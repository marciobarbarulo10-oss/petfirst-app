import { StyleSheet, Text, View, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';

export default function CadastroNomeScreen({ navigation, route }) {
  const [nome, setNome] = useState('');
  const { especie } = route.params;
  const emojis = { cachorro: '🐕', gato: '🐈', ave: '🐦', roedor: '🐹', reptil: '🦎', peixe: '🐠' };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.progressBar}>
          <View style={[styles.progress, { width: '66%' }]} />
        </View>
        <Text style={styles.step}>Passo 2 de 3</Text>
        <Text style={styles.emoji}>{emojis[especie]}</Text>
        <Text style={styles.title}>Qual o nome{'\n'}do seu pet?</Text>
        <Text style={styles.sub}>Vamos usar para personalizar toda a experiência.</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Luna, Thor, Mel..."
          placeholderTextColor="#B8B0A8"
          value={nome}
          onChangeText={setNome}
          autoFocus
          maxLength={20}
        />
        {nome.length > 0 && (
          <View style={styles.preview}>
            <Text style={styles.previewText}>Olá, {nome}! 👋</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.btn, nome.length < 2 && styles.btnDesabilitado]}
          onPress={() => nome.length >= 2 && navigation.navigate('MainTabs', { petName: nome, petEspecie: especie })}
        >
          <Text style={styles.btnText}>
            {nome.length >= 2 ? `Criar perfil do ${nome} 🎉` : 'Digite o nome para continuar'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF9' },
  content: { padding: 24, paddingTop: 60 },
  progressBar: { height: 6, backgroundColor: '#E8E4DF', borderRadius: 3, marginBottom: 12 },
  progress: { height: 6, backgroundColor: '#E07B5A', borderRadius: 3 },
  step: { fontSize: 13, color: '#B8B0A8', marginBottom: 24, fontWeight: '500' },
  emoji: { fontSize: 64, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '900', color: '#4A4540', marginBottom: 8, lineHeight: 34 },
  sub: { fontSize: 15, color: '#7A736C', marginBottom: 32 },
  input: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#E8E4DF', borderRadius: 16, padding: 18, fontSize: 20, fontWeight: '600', color: '#4A4540', marginBottom: 16 },
  preview: { backgroundColor: '#FAF6F1', borderRadius: 12, padding: 16, marginBottom: 24, alignItems: 'center' },
  previewText: { fontSize: 18, fontWeight: '700', color: '#E07B5A' },
  btn: { backgroundColor: '#E07B5A', paddingVertical: 18, borderRadius: 100, alignItems: 'center', shadowColor: '#E07B5A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  btnDesabilitado: { backgroundColor: '#D3D1C7', shadowOpacity: 0 },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});