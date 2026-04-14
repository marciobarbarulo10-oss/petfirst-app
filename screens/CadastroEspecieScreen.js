import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';

const especies = [
  { id: 'cachorro', emoji: '🐕', nome: 'Cachorro' },
  { id: 'gato', emoji: '🐈', nome: 'Gato' },
  { id: 'ave', emoji: '🐦', nome: 'Ave' },
  { id: 'roedor', emoji: '🐹', nome: 'Roedor' },
  { id: 'reptil', emoji: '🦎', nome: 'Réptil' },
  { id: 'peixe', emoji: '🐠', nome: 'Peixe' },
];

export default function CadastroEspecieScreen({ navigation }) {
  const [selecionado, setSelecionado] = useState(null);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: '33%' }]} />
      </View>
      <Text style={styles.step}>Passo 1 de 3</Text>
      <Text style={styles.title}>Que tipo de pet{'\n'}você tem? 🐾</Text>
      <Text style={styles.sub}>Vamos personalizar tudo para o seu animal.</Text>
      <View style={styles.grid}>
        {especies.map(e => (
          <TouchableOpacity
            key={e.id}
            style={[styles.card, selecionado === e.id && styles.cardSelecionado]}
            onPress={() => setSelecionado(e.id)}
          >
            <Text style={styles.cardEmoji}>{e.emoji}</Text>
            <Text style={[styles.cardNome, selecionado === e.id && styles.cardNomeSelecionado]}>{e.nome}</Text>
            {selecionado === e.id && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[styles.btn, !selecionado && styles.btnDesabilitado]}
        onPress={() => selecionado && navigation.navigate('CadastroNome', { especie: selecionado })}
      >
        <Text style={styles.btnText}>Continuar →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF9' },
  content: { padding: 24, paddingTop: 60 },
  progressBar: { height: 6, backgroundColor: '#E8E4DF', borderRadius: 3, marginBottom: 12 },
  progress: { height: 6, backgroundColor: '#E07B5A', borderRadius: 3 },
  step: { fontSize: 13, color: '#B8B0A8', marginBottom: 16, fontWeight: '500' },
  title: { fontSize: 28, fontWeight: '900', color: '#4A4540', marginBottom: 8, lineHeight: 34 },
  sub: { fontSize: 15, color: '#7A736C', marginBottom: 32 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 32, justifyContent: 'space-between' },
  card: { width: '31%', aspectRatio: 1, backgroundColor: '#fff', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#E8E4DF', marginBottom: 12, position: 'relative' },
  cardSelecionado: { borderColor: '#E07B5A', backgroundColor: '#FFF0EB' },
  cardEmoji: { fontSize: 32, marginBottom: 4 },
  cardNome: { fontSize: 12, fontWeight: '600', color: '#7A736C' },
  cardNomeSelecionado: { color: '#E07B5A' },
  check: { position: 'absolute', top: 6, right: 8, fontSize: 12, color: '#E07B5A', fontWeight: '700' },
  btn: { backgroundColor: '#E07B5A', paddingVertical: 18, borderRadius: 100, alignItems: 'center', shadowColor: '#E07B5A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  btnDesabilitado: { backgroundColor: '#D3D1C7', shadowOpacity: 0 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});