import { StyleSheet, Text, View, TouchableOpacity, StatusBar, ScrollView } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.logo}>Pet<Text style={styles.accent}>First</Text></Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.emoji}>🐾</Text>
        <Text style={styles.title}>Bem-vindo ao{'\n'}PetFirst!</Text>
        <Text style={styles.sub}>O guia completo para tutores de primeira viagem. Gratuito para sempre.</Text>
        <View style={styles.features}>
          <Text style={styles.feat}>✅  Carteirinha digital de vacinas</Text>
          <Text style={styles.feat}>✅  Lembretes inteligentes</Text>
          <Text style={styles.feat}>✅  Assistente com IA</Text>
          <Text style={styles.feat}>✅  Comunidade de tutores</Text>
        </View>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('CadastroEspecie')}>
          <Text style={styles.btnText}>Começar agora — é grátis 🚀</Text>
        </TouchableOpacity>
        <Text style={styles.note}>Sem cartão de crédito. Sem pegadinhas.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFDF9' },
  header: { backgroundColor: '#4A4540', paddingTop: 60, paddingBottom: 24, alignItems: 'center' },
  logo: { fontSize: 32, fontWeight: '900', color: '#FFFDF9' },
  accent: { color: '#E07B5A' },
  content: { padding: 32, alignItems: 'center' },
  emoji: { fontSize: 72, marginBottom: 16, marginTop: 24 },
  title: { fontSize: 32, fontWeight: '900', color: '#4A4540', textAlign: 'center', marginBottom: 12, lineHeight: 38 },
  sub: { fontSize: 16, color: '#7A736C', textAlign: 'center', lineHeight: 24, marginBottom: 32 },
  features: { alignSelf: 'stretch', backgroundColor: '#FAF6F1', borderRadius: 16, padding: 20, marginBottom: 32 },
  feat: { fontSize: 15, color: '#4A4540', fontWeight: '500', marginBottom: 10 },
  btn: { backgroundColor: '#E07B5A', paddingVertical: 18, paddingHorizontal: 40, borderRadius: 100, width: '100%', alignItems: 'center', marginBottom: 12, shadowColor: '#E07B5A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  note: { fontSize: 13, color: '#B8B0A8', marginBottom: 40 },
});