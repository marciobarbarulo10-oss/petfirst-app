import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';

// Tabela de porções recomendadas por peso (em gramas/dia) para cães e gatos
function calcularPorcao(peso, especie) {
  if (!peso || isNaN(peso) || peso <= 0) return null;
  const p = parseFloat(peso);
  if (especie === 'cachorro') {
    if (p <= 5) return Math.round(p * 40);
    if (p <= 15) return Math.round(p * 35);
    if (p <= 30) return Math.round(p * 30);
    return Math.round(p * 25);
  }
  if (especie === 'gato') {
    return Math.round(p * 30);
  }
  // Para outras espécies, orientação genérica
  return null;
}

const alimentosProibidos = [
  { emoji: '🍇', nome: 'Uva e passas' },
  { emoji: '🍫', nome: 'Chocolate' },
  { emoji: '🧅', nome: 'Cebola e cebolinha' },
  { emoji: '🧄', nome: 'Alho' },
  { emoji: '🥑', nome: 'Abacate' },
  { emoji: '☕', nome: 'Cafeína' },
];

const alimentosLiberados = [
  { emoji: '🥕', nome: 'Cenoura' },
  { emoji: '🍗', nome: 'Frango cozido' },
  { emoji: '🍚', nome: 'Arroz branco' },
  { emoji: '🍠', nome: 'Batata doce' },
];

export default function AlimentacaoScreen({ route }) {
  const { petName, petEspecie } = route?.params || {};
  const [peso, setPeso] = useState('');

  const porcao = calcularPorcao(peso, petEspecie);

  // Frequência de alimentação baseada em animal jovem/adulto genérico
  const frequencia = petEspecie === 'cachorro' || petEspecie === 'gato'
    ? '2 a 3 vezes por dia (filhotes: 4x)'
    : 'Consulte um especialista para a frequência ideal';

  const mostrarCalculadora = petEspecie === 'cachorro' || petEspecie === 'gato';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitulo}>Alimentação</Text>
        <Text style={styles.headerSub}>Guia para {petName || 'seu pet'}</Text>
      </View>

      <View style={styles.body}>
        {/* Card de peso e calculadora */}
        {mostrarCalculadora ? (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Calculadora de porção</Text>
            <Text style={styles.cardSub}>Informe o peso atual do seu pet</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputPeso}
                placeholder="Ex: 8.5"
                placeholderTextColor="#B8B0A8"
                keyboardType="decimal-pad"
                value={peso}
                onChangeText={setPeso}
                maxLength={5}
              />
              <View style={styles.unidadeTag}>
                <Text style={styles.unidadeText}>kg</Text>
              </View>
            </View>

            {/* Resultado da porção */}
            {porcao ? (
              <View style={styles.resultadoPorcao}>
                <Text style={styles.resultadoLabel}>Porção diária recomendada</Text>
                <Text style={styles.resultadoValor}>{porcao}g</Text>
                <Text style={styles.resultadoObs}>
                  Divida em {petEspecie === 'cachorro' ? '2 a 3' : '2 a 3'} refeições ao longo do dia
                </Text>
              </View>
            ) : peso.length > 0 && (
              <View style={styles.resultadoVazio}>
                <Text style={styles.resultadoVazioText}>Digite um peso válido</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.card}>
            <Text style={styles.cardTitulo}>Alimentação</Text>
            <Text style={styles.cardSub}>
              Para {petEspecie || 'seu pet'}, consulte um veterinário especializado para orientações de dieta personalizadas.
            </Text>
          </View>
        )}

        {/* Frequência */}
        <View style={styles.card}>
          <Text style={styles.cardTitulo}>Frequência</Text>
          <View style={styles.frequenciaRow}>
            <Text style={styles.frequenciaEmoji}>🕐</Text>
            <Text style={styles.frequenciaTexto}>{frequencia}</Text>
          </View>
        </View>

        {/* Alimentos proibidos */}
        <Text style={styles.secaoTitulo}>Alimentos proibidos</Text>
        <View style={styles.listaCard}>
          {alimentosProibidos.map((item, index) => (
            <View
              key={item.nome}
              style={[
                styles.listaItem,
                index < alimentosProibidos.length - 1 && styles.listaItemBorda,
              ]}
            >
              <Text style={styles.listaEmoji}>{item.emoji}</Text>
              <Text style={styles.listaNomeProibido}>{item.nome}</Text>
              <View style={styles.tagPerigo}>
                <Text style={styles.tagPerigoText}>Tóxico</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Alimentos liberados */}
        <Text style={styles.secaoTitulo}>Alimentos liberados</Text>
        <View style={[styles.listaCard, styles.listaCardVerde]}>
          {alimentosLiberados.map((item, index) => (
            <View
              key={item.nome}
              style={[
                styles.listaItem,
                index < alimentosLiberados.length - 1 && styles.listaItemBorda,
              ]}
            >
              <Text style={styles.listaEmoji}>{item.emoji}</Text>
              <Text style={styles.listaNomeLiberado}>{item.nome}</Text>
              <View style={styles.tagSeguro}>
                <Text style={styles.tagSeguroText}>OK</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Aviso veterinário */}
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>
            As porções são estimativas gerais. Consulte seu veterinário para uma dieta personalizada.
          </Text>
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
    paddingBottom: 24,
    paddingHorizontal: 24,
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
  body: {
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    padding: 20,
    marginBottom: 16,
  },
  cardTitulo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4A4540',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#7A736C',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  inputPeso: {
    flex: 1,
    backgroundColor: '#FAF6F1',
    borderWidth: 2,
    borderColor: '#E8E4DF',
    borderRadius: 12,
    padding: 14,
    fontSize: 24,
    fontWeight: '700',
    color: '#4A4540',
    marginRight: 10,
  },
  unidadeTag: {
    backgroundColor: '#E8E4DF',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  unidadeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#7A736C',
  },
  resultadoPorcao: {
    backgroundColor: '#FFF0EB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 2,
    borderColor: '#E07B5A',
  },
  resultadoLabel: {
    fontSize: 12,
    color: '#E07B5A',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  resultadoValor: {
    fontSize: 40,
    fontWeight: '900',
    color: '#E07B5A',
    marginBottom: 4,
  },
  resultadoObs: {
    fontSize: 13,
    color: '#7A736C',
    textAlign: 'center',
  },
  resultadoVazio: {
    marginTop: 12,
    alignItems: 'center',
  },
  resultadoVazioText: {
    fontSize: 13,
    color: '#B8B0A8',
  },
  frequenciaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  frequenciaEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  frequenciaTexto: {
    flex: 1,
    fontSize: 15,
    color: '#4A4540',
    fontWeight: '500',
    lineHeight: 22,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A4540',
    marginBottom: 12,
  },
  listaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    marginBottom: 24,
    overflow: 'hidden',
  },
  listaCardVerde: {
    borderColor: 'rgba(123,174,138,0.4)',
  },
  listaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  listaItemBorda: {
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4DF',
  },
  listaEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  listaNomeProibido: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#4A4540',
  },
  listaNomeLiberado: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#4A4540',
  },
  tagPerigo: {
    backgroundColor: 'rgba(226,75,74,0.12)',
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  tagPerigoText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#E24B4A',
  },
  tagSeguro: {
    backgroundColor: 'rgba(123,174,138,0.15)',
    borderRadius: 100,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  tagSeguroText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7BAE8A',
  },
  aviso: {
    backgroundColor: '#FAF6F1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  avisoTexto: {
    fontSize: 12,
    color: '#7A736C',
    textAlign: 'center',
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
