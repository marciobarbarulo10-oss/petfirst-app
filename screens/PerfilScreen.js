import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { usePetData } from '../hooks/usePetData';

const opcoesConfiguracao = [
  { emoji: '🔔', label: 'Notificações', desc: 'Gerencie seus lembretes' },
  { emoji: '🔒', label: 'Privacidade', desc: 'Dados e permissões' },
  { emoji: 'ℹ️', label: 'Sobre o app', desc: 'Versão 1.0.0' },
  { emoji: '⭐', label: 'Avaliar o app', desc: 'Nos ajude a melhorar' },
];

export default function PerfilScreen({ route }) {
  const { petData, carregando, salvarPetData } = usePetData();

  // route.params tem prioridade logo após o onboarding; AsyncStorage serve como fallback
  const petNameInicial = route?.params?.petName || petData.petName || '';
  const petEspecieInicial = route?.params?.petEspecie || petData.petEspecie || '';

  const emojis = { cachorro: '🐕', gato: '🐈', ave: '🐦', roedor: '🐹', reptil: '🦎', peixe: '🐠' };

  const [editando, setEditando] = useState(false);

  // Campos editáveis — inicializados com os dados persistidos
  const [raca, setRaca] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');

  // Atualiza os campos quando os dados do AsyncStorage terminam de carregar
  useEffect(() => {
    if (!carregando) {
      setRaca(petData.raca || '');
      setIdade(petData.idade || '');
      setPeso(petData.peso || '');
    }
  }, [carregando]);

  const petName = petNameInicial || petData.petName || 'Meu Pet';
  const petEspecie = petEspecieInicial || petData.petEspecie || '';
  const emoji = emojis[petEspecie] || '🐾';

  // Calcula dias juntos a partir de uma data de cadastro fictícia
  const diasJuntos = 45;

  async function handleSalvar() {
    await salvarPetData({ raca, idade, peso });
    setEditando(false);
  }

  function handleEditar() {
    if (editando) {
      handleSalvar();
    } else {
      setEditando(true);
    }
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com foto e nome */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnEditar} onPress={handleEditar}>
          <Text style={styles.btnEditarText}>{editando ? 'Salvar' : 'Editar'}</Text>
        </TouchableOpacity>
        <View style={styles.fotoPerfil}>
          <Text style={styles.fotoEmoji}>{emoji}</Text>
        </View>
        <Text style={styles.nomePet}>{petName}</Text>
        <Text style={styles.especiePet}>
          {petEspecie ? petEspecie.charAt(0).toUpperCase() + petEspecie.slice(1) : 'Pet'}
        </Text>
      </View>

      <View style={styles.body}>
        {/* Card de informações do pet */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Informações do pet</Text>

          <View style={styles.infoLinha}>
            <Text style={styles.infoLabel}>Espécie</Text>
            <Text style={styles.infoValor}>
              {petEspecie ? petEspecie.charAt(0).toUpperCase() + petEspecie.slice(1) : '—'}
            </Text>
          </View>

          <View style={styles.infoLinhaSeparador} />

          <View style={styles.infoLinha}>
            <Text style={styles.infoLabel}>Raça</Text>
            {editando ? (
              <TextInput
                style={styles.infoInput}
                value={raca}
                onChangeText={setRaca}
                placeholder="Ex: Golden, Siamês..."
                placeholderTextColor="#B8B0A8"
              />
            ) : (
              <Text style={styles.infoValor}>{raca || 'Não informada'}</Text>
            )}
          </View>

          <View style={styles.infoLinhaSeparador} />

          <View style={styles.infoLinha}>
            <Text style={styles.infoLabel}>Idade</Text>
            {editando ? (
              <TextInput
                style={styles.infoInput}
                value={idade}
                onChangeText={setIdade}
                placeholder="Ex: 2 anos"
                placeholderTextColor="#B8B0A8"
                keyboardType="default"
              />
            ) : (
              <Text style={styles.infoValor}>{idade || 'Não informada'}</Text>
            )}
          </View>

          <View style={styles.infoLinhaSeparador} />

          <View style={styles.infoLinha}>
            <Text style={styles.infoLabel}>Peso</Text>
            {editando ? (
              <TextInput
                style={styles.infoInput}
                value={peso}
                onChangeText={setPeso}
                placeholder="Ex: 4,5 kg"
                placeholderTextColor="#B8B0A8"
                keyboardType="decimal-pad"
              />
            ) : (
              <Text style={styles.infoValor}>{peso ? `${peso} kg` : 'Não informado'}</Text>
            )}
          </View>
        </View>

        {/* Estatísticas */}
        <Text style={styles.secaoTitulo}>Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>✅</Text>
            <Text style={styles.statValor}>2</Text>
            <Text style={styles.statLabel}>Vacinas em dia</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔔</Text>
            <Text style={styles.statValor}>3</Text>
            <Text style={styles.statLabel}>Lembretes ativos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🗓️</Text>
            <Text style={styles.statValor}>{diasJuntos}</Text>
            <Text style={styles.statLabel}>Dias juntos</Text>
          </View>
        </View>

        {/* Configurações */}
        <Text style={styles.secaoTitulo}>Configurações</Text>
        <View style={styles.card}>
          {opcoesConfiguracao.map((op, index) => (
            <View key={op.label}>
              <TouchableOpacity style={styles.configItem}>
                <Text style={styles.configEmoji}>{op.emoji}</Text>
                <View style={styles.configInfo}>
                  <Text style={styles.configLabel}>{op.label}</Text>
                  <Text style={styles.configDesc}>{op.desc}</Text>
                </View>
                <Text style={styles.configSeta}>›</Text>
              </TouchableOpacity>
              {index < opcoesConfiguracao.length - 1 && (
                <View style={styles.infoLinhaSeparador} />
              )}
            </View>
          ))}
        </View>

        {/* Versão do app */}
        <Text style={styles.versao}>PetFirst v1.0.0 — Feito com 🧡 para pets e tutores</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFDF9',
  },
  header: {
    backgroundColor: '#4A4540',
    paddingTop: 60,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  btnEditar: {
    position: 'absolute',
    top: 64,
    right: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 100,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  btnEditarText: {
    fontSize: 13,
    color: '#FFFDF9',
    fontWeight: '600',
  },
  fotoPerfil: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FAF6F1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#E07B5A',
    marginBottom: 14,
  },
  fotoEmoji: {
    fontSize: 52,
  },
  nomePet: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFDF9',
    marginBottom: 4,
  },
  especiePet: {
    fontSize: 14,
    color: '#B8B0A8',
  },
  body: {
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    padding: 20,
    marginBottom: 24,
  },
  cardTitulo: {
    fontSize: 15,
    fontWeight: '800',
    color: '#4A4540',
    marginBottom: 16,
  },
  infoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  infoLinhaSeparador: {
    height: 1,
    backgroundColor: '#E8E4DF',
  },
  infoLabel: {
    fontSize: 14,
    color: '#7A736C',
    fontWeight: '500',
  },
  infoValor: {
    fontSize: 14,
    color: '#4A4540',
    fontWeight: '600',
  },
  infoInput: {
    fontSize: 14,
    color: '#E07B5A',
    fontWeight: '600',
    textAlign: 'right',
    minWidth: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#E07B5A',
    paddingVertical: 2,
    paddingHorizontal: 4,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A4540',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 8,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValor: {
    fontSize: 24,
    fontWeight: '900',
    color: '#4A4540',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#7A736C',
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 16,
  },
  configItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  configEmoji: {
    fontSize: 22,
    marginRight: 14,
    width: 28,
    textAlign: 'center',
  },
  configInfo: {
    flex: 1,
  },
  configLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4A4540',
    marginBottom: 2,
  },
  configDesc: {
    fontSize: 12,
    color: '#7A736C',
  },
  configSeta: {
    fontSize: 22,
    color: '#B8B0A8',
    fontWeight: '300',
  },
  versao: {
    textAlign: 'center',
    fontSize: 12,
    color: '#B8B0A8',
    marginBottom: 32,
    lineHeight: 20,
  },
});
