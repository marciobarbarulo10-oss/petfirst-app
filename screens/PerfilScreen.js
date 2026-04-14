import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

const opcoesCofiguracao = [
  { emoji: '🔔', label: 'Notificações', desc: 'Gerencie seus lembretes' },
  { emoji: '🔒', label: 'Privacidade', desc: 'Dados e permissões' },
  { emoji: 'ℹ️', label: 'Sobre o app', desc: 'Versão 1.0.0' },
  { emoji: '⭐', label: 'Avaliar o app', desc: 'Nos ajude a melhorar' },
];

export default function PerfilScreen({ route }) {
  const { petName, petEspecie } = route?.params || {};
  const emojis = { cachorro: '🐕', gato: '🐈', ave: '🐦', roedor: '🐹', reptil: '🦎', peixe: '🐠' };
  const emoji = emojis[petEspecie] || '🐾';

  const [editando, setEditando] = useState(false);

  // Calcula dias juntos a partir de uma data de cadastro fictícia
  const diasJuntos = 45;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header com foto e nome */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.btnEditar} onPress={() => setEditando(!editando)}>
          <Text style={styles.btnEditarText}>{editando ? 'Salvar' : 'Editar'}</Text>
        </TouchableOpacity>
        <View style={styles.fotoPerfil}>
          <Text style={styles.fotoEmoji}>{emoji}</Text>
        </View>
        <Text style={styles.nomePet}>{petName || 'Meu Pet'}</Text>
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
            <Text style={[styles.infoValor, editando && styles.infoValorEditando]}>
              {editando ? 'Toque para editar' : 'Não informada'}
            </Text>
          </View>
          <View style={styles.infoLinhaSeparador} />
          <View style={styles.infoLinha}>
            <Text style={styles.infoLabel}>Idade</Text>
            <Text style={[styles.infoValor, editando && styles.infoValorEditando]}>
              {editando ? 'Toque para editar' : 'Não informada'}
            </Text>
          </View>
          <View style={styles.infoLinhaSeparador} />
          <View style={styles.infoLinha}>
            <Text style={styles.infoLabel}>Peso</Text>
            <Text style={[styles.infoValor, editando && styles.infoValorEditando]}>
              {editando ? 'Toque para editar' : 'Não informado'}
            </Text>
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
          {opcoesCofiguracao.map((op, index) => (
            <View key={op.label}>
              <TouchableOpacity style={styles.configItem}>
                <Text style={styles.configEmoji}>{op.emoji}</Text>
                <View style={styles.configInfo}>
                  <Text style={styles.configLabel}>{op.label}</Text>
                  <Text style={styles.configDesc}>{op.desc}</Text>
                </View>
                <Text style={styles.configSeta}>›</Text>
              </TouchableOpacity>
              {index < opcoesCofiguracao.length - 1 && (
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
  infoValorEditando: {
    color: '#E07B5A',
    fontStyle: 'italic',
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
