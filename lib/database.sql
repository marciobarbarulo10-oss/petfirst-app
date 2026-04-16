-- ============================================
-- SCHEMA DO BANCO DE DADOS PETFIRST
-- Execute este arquivo no SQL Editor do Supabase
-- ============================================

-- Habilita extensão UUID se ainda não estiver habilitada
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: pets
-- Armazena os dados dos pets cadastrados
-- ============================================
CREATE TABLE IF NOT EXISTS pets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  especie VARCHAR(50) NOT NULL,
  raca VARCHAR(100),
  idade VARCHAR(50),
  peso VARCHAR(20),
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar pets por usuário
CREATE INDEX IF NOT EXISTS idx_pets_user_id ON pets(user_id);

-- ============================================
-- TABELA: vaccines
-- Armazena o histórico de vacinas dos pets
-- ============================================
CREATE TABLE IF NOT EXISTS vaccines (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  nome VARCHAR(100) NOT NULL,
  data_aplicacao DATE NOT NULL,
  proxima_data DATE,
  clinica VARCHAR(200),
  status VARCHAR(20) DEFAULT 'aplicada' CHECK (status IN ('aplicada', 'proxima')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar vacinas por pet
CREATE INDEX IF NOT EXISTS idx_vaccines_pet_id ON vaccines(pet_id);

-- Índice para buscar vacinas por status
CREATE INDEX IF NOT EXISTS idx_vaccines_status ON vaccines(status);

-- ============================================
-- TABELA: reminders
-- Armazena lembretes e compromissos dos pets
-- ============================================
CREATE TABLE IF NOT EXISTS reminders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  pet_id UUID REFERENCES pets(id) ON DELETE CASCADE NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('vacina', 'consulta', 'medicamento', 'banho', 'racao', 'outro')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para buscar lembretes por pet
CREATE INDEX IF NOT EXISTS idx_reminders_pet_id ON reminders(pet_id);

-- Índice para buscar lembretes ativos
CREATE INDEX IF NOT EXISTS idx_reminders_ativo ON reminders(ativo);

-- Índice para buscar por data (útil para notificações)
CREATE INDEX IF NOT EXISTS idx_reminders_data ON reminders(data);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- Garante que usuários só acessem seus próprios dados
-- ============================================

-- Habilita RLS nas tabelas
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Política para pets: usuário só vê seus próprios pets
CREATE POLICY "Usuários podem ver seus próprios pets"
  ON pets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir seus próprios pets"
  ON pets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios pets"
  ON pets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios pets"
  ON pets FOR DELETE
  USING (auth.uid() = user_id);

-- Política para vacinas: usuário só acessa vacinas dos seus pets
CREATE POLICY "Usuários podem ver vacinas dos seus pets"
  ON vaccines FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = vaccines.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem inserir vacinas nos seus pets"
  ON vaccines FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar vacinas dos seus pets"
  ON vaccines FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = vaccines.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem deletar vacinas dos seus pets"
  ON vaccines FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = vaccines.pet_id AND pets.user_id = auth.uid()
  ));

-- Política para lembretes: usuário só acessa lembretes dos seus pets
CREATE POLICY "Usuários podem ver lembretes dos seus pets"
  ON reminders FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = reminders.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem inserir lembretes nos seus pets"
  ON reminders FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem atualizar lembretes dos seus pets"
  ON reminders FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = reminders.pet_id AND pets.user_id = auth.uid()
  ));

CREATE POLICY "Usuários podem deletar lembretes dos seus pets"
  ON reminders FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM pets WHERE pets.id = reminders.pet_id AND pets.user_id = auth.uid()
  ));

-- ============================================
-- FUNÇÕES AUXILIARES
-- ============================================

-- Função para contar vacinas de um pet
CREATE OR REPLACE FUNCTION contar_vacinas_pet(pet_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM vaccines WHERE pet_id = pet_uuid;
$$ LANGUAGE SQL;

-- Função para contar lembretes ativos de um pet
CREATE OR REPLACE FUNCTION contar_lembretes_ativos_pet(pet_uuid UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM reminders WHERE pet_id = pet_uuid AND ativo = true;
$$ LANGUAGE SQL;

-- ============================================
-- COMENTÁRIOS NAS TABELAS (documentação)
-- ============================================

COMMENT ON TABLE pets IS 'Tabela principal de pets cadastrados no PetFirst';
COMMENT ON TABLE vaccines IS 'Histórico de vacinas e imunizações dos pets';
COMMENT ON TABLE reminders IS 'Lembretes e compromissos agendados para os pets';

COMMENT ON COLUMN vaccines.status IS 'aplicada = vacina já tomada, proxima = vacina agendada';
COMMENT ON COLUMN reminders.tipo IS 'Tipo do lembrete: vacina, consulta, medicamento, banho, racao, outro';
