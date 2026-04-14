import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';

// Dados mockados das vacinas para demonstração
const vacinas = [
  {
    id: 1,
    nome: 'Vacina V8',
    status: 'aplicada',
    data: '15/01/2026',
  },
  {
    id: 2,
    nome: 'Antirrábica',
    status: 'aplicada',
    data: '20/02/2026',
  },
  {
    id: 3,
    nome: 'V8 Reforço',
    status: 'proxima',
    data: '15/04/2026',
  },
  {
    id: 4,
    nome: 'Vermífugo',
    status: 'proxima',
    data: '01/05/2026',
  },
];

export default function SaudeScreen({ route }) {
  const { petName, petEspecie } = route?.params || {};
  const emojis = { cachorro: '🐕', gato: '🐈', ave: '🐦', roedor: '🐹', reptil: '🦎', peixe: '🐠' };
  const emoji = emojis[petEspecie] || '🐾';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitulo}>Saúde</Text>
            <Text style={styles.headerSub}>Carteirinha de {petName || 'seu pet'}</Text>
          </View>
          <TouchableOpacity style={styles.headerBtnAdd}>
            <Text style={styles.headerBtnAddText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* Card premium do pet */}
          <View style={styles.cardPet}>
            <View style={styles.fotoPet}>
              <Text style={styles.fotoPetEmoji}>{emoji}</Text>
            </View>
            <View style={styles.cardPetInfo}>
              <Text style={styles.cardPetNome}>{petName || 'Meu Pet'}</Text>
              <Text style={styles.cardPetEspecie}>{petEspecie ? petEspecie.charAt(0).toUpperCase() + petEspecie.slice(1) : 'Pet'}</Text>
              <View style={styles.cardPetBadge}>
                <Text style={styles.cardPetBadgeText}>Carteirinha ativa</Text>
              </View>
            </View>
          </View>

          {/* Seção de vacinas com timeline */}
          <Text style={styles.secaoTitulo}>Vacinas</Text>
          <View style={styles.timeline}>
            {vacinas.map((vacina, index) => (
              <View key={vacina.id} style={styles.timelineItem}>
                {/* Linha vertical da timeline */}
                <View style={styles.timelineEsquerda}>
                  <View style={[
                    styles.timelinePonto,
                    vacina.status === 'proxima' && styles.timelinePontoProxima,
                  ]}>
                    <Text style={styles.timelinePontoIcon}>
                      {vacina.status === 'aplicada' ? '✓' : '!'}
                    </Text>
                  </View>
                  {/* Linha conectando os pontos (exceto no último) */}
                  {index < vacinas.length - 1 && <View style={styles.timelineLinha} />}
                </View>

                {/* Conteúdo do item */}
                <View style={[
                  styles.timelineConteudo,
                  vacina.status === 'proxima' && styles.timelineConteudoProxima,
                ]}>
                  <View style={styles.timelineHeader}>
                    <Text style={[
                      styles.timelineNome,
                      vacina.status === 'proxima' && styles.timelineNomeProxima,
                    ]}>
                      {vacina.nome}
                    </Text>
                    <View style={[
                      styles.timelineTag,
                      vacina.status === 'proxima' && styles.timelineTagProxima,
                    ]}>
                      <Text style={[
                        styles.timelineTagText,
                        vacina.status === 'proxima' && styles.timelineTagTextProxima,
                      ]}>
                        {vacina.status === 'aplicada' ? 'Aplicada' : 'Próxima'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.timelineData}>{vacina.data}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* FAB — botão flutuante para adicionar vacina */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitulo: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFDF9',
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 14,
    color: '#B8B0A8',
  },
  headerBtnAdd: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E07B5A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBtnAddText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 28,
  },
  body: {
    padding: 24,
  },
  cardPet: {
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  fotoPet: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FAF6F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#E8E4DF',
  },
  fotoPetEmoji: {
    fontSize: 38,
  },
  cardPetInfo: {
    flex: 1,
  },
  cardPetNome: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4A4540',
    marginBottom: 2,
  },
  cardPetEspecie: {
    fontSize: 14,
    color: '#7A736C',
    marginBottom: 10,
  },
  cardPetBadge: {
    backgroundColor: 'rgba(123,174,138,0.15)',
    borderRadius: 100,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: 'flex-start',
  },
  cardPetBadgeText: {
    fontSize: 12,
    color: '#7BAE8A',
    fontWeight: '700',
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A4540',
    marginBottom: 20,
  },
  timeline: {
    marginBottom: 80,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  timelineEsquerda: {
    alignItems: 'center',
    marginRight: 16,
    width: 28,
  },
  timelinePonto: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#7BAE8A',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  timelinePontoProxima: {
    backgroundColor: '#E07B5A',
  },
  timelinePontoIcon: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  timelineLinha: {
    width: 2,
    flex: 1,
    backgroundColor: '#E8E4DF',
    minHeight: 20,
  },
  timelineConteudo: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    padding: 16,
    marginBottom: 12,
  },
  timelineConteudoProxima: {
    borderColor: '#E07B5A',
    backgroundColor: '#FFF0EB',
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  timelineNome: {
    fontSize: 15,
    fontWeight: '700',
    color: '#4A4540',
  },
  timelineNomeProxima: {
    color: '#E07B5A',
  },
  timelineTag: {
    backgroundColor: 'rgba(123,174,138,0.15)',
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  timelineTagProxima: {
    backgroundColor: 'rgba(224,123,90,0.15)',
  },
  timelineTagText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7BAE8A',
  },
  timelineTagTextProxima: {
    color: '#E07B5A',
  },
  timelineData: {
    fontSize: 13,
    color: '#7A736C',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E07B5A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E07B5A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  fabText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 32,
  },
});
