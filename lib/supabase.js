import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Credenciais do Supabase via variáveis de ambiente
// No Expo, variáveis com prefixo EXPO_PUBLIC_ são expostas ao app
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Valida se as variáveis estão configuradas
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error(
    'Erro: Variáveis de ambiente do Supabase não configuradas.\n' +
    'Crie um arquivo .env na raiz do projeto com:\n' +
    'EXPO_PUBLIC_SUPABASE_URL=sua_url\n' +
    'EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave'
  );
}

// Cria o cliente Supabase com persistência de sessão via AsyncStorage
export const supabase = createClient(SUPABASE_URL || '', SUPABASE_ANON_KEY || '', {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// ============================================
// FUNÇÕES AUXILIARES PARA VACINAS
// ============================================

/**
 * Busca todas as vacinas de um pet específico
 * @param {string} petId - ID do pet
 * @returns {Promise<{data: Array, error: Object|null}>}
 */
export async function buscarVacinasPorPet(petId) {
  try {
    const { data, error } = await supabase
      .from('vaccines')
      .select('*')
      .eq('pet_id', petId)
      .order('data_aplicacao', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar vacinas:', error.message);
    return { data: null, error };
  }
}

/**
 * Adiciona uma nova vacina
 * @param {Object} vacina - Dados da vacina
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function adicionarVacina(vacina) {
  try {
    const { data, error } = await supabase
      .from('vaccines')
      .insert([vacina])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao adicionar vacina:', error.message);
    return { data: null, error };
  }
}

/**
 * Atualiza uma vacina existente
 * @param {string} vacinaId - ID da vacina
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function atualizarVacina(vacinaId, dados) {
  try {
    const { data, error } = await supabase
      .from('vaccines')
      .update(dados)
      .eq('id', vacinaId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao atualizar vacina:', error.message);
    return { data: null, error };
  }
}

/**
 * Remove uma vacina
 * @param {string} vacinaId - ID da vacina
 * @returns {Promise<{success: boolean, error: Object|null}>}
 */
export async function removerVacina(vacinaId) {
  try {
    const { error } = await supabase
      .from('vaccines')
      .delete()
      .eq('id', vacinaId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao remover vacina:', error.message);
    return { success: false, error };
  }
}

// ============================================
// FUNÇÕES AUXILIARES PARA PETS
// ============================================

/**
 * Busca os dados de um pet específico
 * @param {string} petId - ID do pet
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function buscarPet(petId) {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('id', petId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar pet:', error.message);
    return { data: null, error };
  }
}

/**
 * Busca todos os pets de um usuário
 * @param {string} userId - ID do usuário
 * @returns {Promise<{data: Array, error: Object|null}>}
 */
export async function buscarPetsPorUsuario(userId) {
  try {
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar pets:', error.message);
    return { data: null, error };
  }
}

/**
 * Cria um novo pet
 * @param {Object} pet - Dados do pet
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function criarPet(pet) {
  try {
    const { data, error } = await supabase
      .from('pets')
      .insert([pet])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar pet:', error.message);
    return { data: null, error };
  }
}

/**
 * Atualiza os dados de um pet
 * @param {string} petId - ID do pet
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function atualizarPet(petId, dados) {
  try {
    const { data, error } = await supabase
      .from('pets')
      .update(dados)
      .eq('id', petId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao atualizar pet:', error.message);
    return { data: null, error };
  }
}

// ============================================
// FUNÇÕES AUXILIARES PARA LEMBRETES
// ============================================

/**
 * Busca todos os lembretes de um pet
 * @param {string} petId - ID do pet
 * @returns {Promise<{data: Array, error: Object|null}>}
 */
export async function buscarLembretesPorPet(petId) {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('pet_id', petId)
      .eq('ativo', true)
      .order('data', { ascending: true });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao buscar lembretes:', error.message);
    return { data: null, error };
  }
}

/**
 * Cria um novo lembrete
 * @param {Object} lembrete - Dados do lembrete
 * @returns {Promise<{data: Object|null, error: Object|null}>}
 */
export async function criarLembrete(lembrete) {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .insert([lembrete])
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Erro ao criar lembrete:', error.message);
    return { data: null, error };
  }
}

/**
 * Desativa um lembrete (não deleta, apenas marca como inativo)
 * @param {string} lembreteId - ID do lembrete
 * @returns {Promise<{success: boolean, error: Object|null}>}
 */
export async function desativarLembrete(lembreteId) {
  try {
    const { error } = await supabase
      .from('reminders')
      .update({ ativo: false })
      .eq('id', lembreteId);

    if (error) throw error;
    return { success: true, error: null };
  } catch (error) {
    console.error('Erro ao desativar lembrete:', error.message);
    return { success: false, error };
  }
}

// ============================================
// FUNÇÕES DE CONEXÃO E STATUS
// ============================================

/**
 * Verifica se há conexão com o Supabase
 * @returns {Promise<boolean>}
 */
export async function verificarConexao() {
  try {
    // Tenta fazer uma query simples para verificar a conexão
    const { error } = await supabase.from('pets').select('id').limit(1);
    return !error;
  } catch {
    return false;
  }
}
