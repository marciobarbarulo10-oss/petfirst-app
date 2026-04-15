import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useEffect, useState } from 'react';
import { usePetData } from '../hooks/usePetData';

// Dicas aleatórias sobre pets exibidas no card "Dica do dia"
const dicas = [
  'Cachorros precisam de pelo menos 30 minutos de exercício por dia para manter a saúde física e mental.',
  'Gatos bebem pouca água naturalmente — prefira fonte de água corrente para estimular a hidratação.',
  'Aves precisam de interação diária para não ficarem estressadas. Fale com elas todo dia!',
  'Roedores têm dentes que crescem sem parar — ofereça sempre algo para roer.',
  'Répteis precisam de temperatura controlada no terrário para regular o metabolismo.',
  'Peixes precisam de aquário com filtro e troca parcial de água semanalmente.',
];

export default function HomeScreen({ route, navigation }) {
  const { petData } = usePetData();

  // route.params tem prioridade durante o onboarding; AsyncStorage serve como fallback
  const petName = route.params?.petName || petData.petName || 'Meu Pet';
  const petEspecie = route.params?.petEspecie || petData.petEspecie || '';

  const emojis = { cachorro: '🐕', gato: '🐈', ave: '🐦', roedor: '🐹', reptil: '🦎', peixe: '🐠' };
  const emoji = emojis[petEspecie] || '🐾';

  // Escolhe uma dica aleatória ao montar a tela
  const [dica] = useState(() => dicas[Math.floor(Math.random() * dicas.length)]);

  // Cards de acesso rápido — cada um navega para a aba correspondente
  const cardsRapidos = [
    { emoji: '💉', label: 'Saúde', aba: 'Saude' },
    { emoji: '🍽️', label: 'Alimentação', aba: 'Alimentacao' },
    { emoji: '🤖', label: 'Assistente', aba: 'Assistente' },
    { emoji: '👤', label: 'Perfil', aba: 'Perfil' },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header escuro com saudação */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSub}>Olá!</Text>
          <Text style={styles.headerTitle}>{petName} {emoji}</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarEmoji}>{emoji}</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Card de destaque — próximo lembrete */}
        <View style={styles.cardDestaque}>
          <View style={styles.cardDestaqueLeft}>
            <Text style={styles.cardDestaqueLabel}>Próximo lembrete</Text>
            <Text style={styles.cardDestaqueTitulo}>Vacina V8</Text>
            <Text style={styles.cardDestaqueInfo}>em 3 dias — 17/04/2026</Text>
          </View>
          <Text style={styles.cardDestaqueEmoji}>💉</Text>
        </View>

        {/* Seção acesso rápido */}
        <Text style={styles.secaoTitulo}>Acesso rápido</Text>
        <View style={styles.grid}>
          {cardsRapidos.map((card) => (
            <TouchableOpacity
              key={card.aba}
              style={styles.gridCard}
              onPress={() => navigation.navigate(card.aba)}
            >
              <Text style={styles.gridEmoji}>{card.emoji}</Text>
              <Text style={styles.gridLabel}>{card.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Dica do dia */}
        <Text style={styles.secaoTitulo}>Dica do dia</Text>
        <View style={styles.cardDica}>
          <Text style={styles.cardDicaEmoji}>💡</Text>
          <Text style={styles.cardDicaTexto}>{dica}</Text>
        </View>
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
    paddingBottom: 28,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerSub: {
    fontSize: 14,
    color: '#B8B0A8',
    fontWeight: '500',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFDF9',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FAF6F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 28,
  },
  body: {
    padding: 24,
  },
  cardDestaque: {
    backgroundColor: '#E07B5A',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
    shadowColor: '#E07B5A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  cardDestaqueLeft: {
    flex: 1,
  },
  cardDestaqueLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  cardDestaqueTitulo: {
    fontSize: 22,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  cardDestaqueInfo: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '500',
  },
  cardDestaqueEmoji: {
    fontSize: 48,
    marginLeft: 12,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A4540',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  gridCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    marginBottom: 12,
  },
  gridEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  gridLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A4540',
  },
  cardDica: {
    backgroundColor: 'rgba(123,174,138,0.15)',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  cardDicaEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  cardDicaTexto: {
    flex: 1,
    fontSize: 14,
    color: '#4A4540',
    lineHeight: 22,
    fontWeight: '500',
  },
});
