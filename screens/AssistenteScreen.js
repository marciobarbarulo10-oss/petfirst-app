import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useState, useRef } from 'react';

// Respostas simuladas do assistente (sem OpenAI ainda — será integrado depois)
const respostasSimuladas = [
  'Entendi! Para garantir o bem-estar do seu pet, recomendo sempre consultar um veterinário de confiança. Mas posso te ajudar com informações gerais! 🐾',
  'Boa pergunta! Cada pet tem necessidades únicas. O mais importante é manter a vacinação em dia e fazer check-ups regulares.',
  'Isso é muito comum entre tutores de primeira viagem. Fique tranquilo! Com atenção e carinho, você está no caminho certo. 💛',
  'Para essa questão específica, o ideal é conversar com um veterinário. Mas no geral, monitorar o comportamento e apetite do pet é um ótimo indicador de saúde.',
];

// Sugestões rápidas para o usuário
const sugestoes = [
  'Posso dar banana?',
  'Quando vacinar?',
  'Quantidade de ração',
];

export default function AssistenteScreen() {
  const [mensagens, setMensagens] = useState([
    {
      id: 1,
      tipo: 'assistente',
      texto: 'Olá! Sou o assistente do PetFirst 🐾 Como posso ajudar você e seu pet hoje?',
    },
  ]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const scrollRef = useRef(null);

  function enviarMensagem(textoMensagem) {
    const msg = textoMensagem || texto;
    if (!msg.trim() || enviando) return;

    const novaMensagemUsuario = {
      id: Date.now(),
      tipo: 'usuario',
      texto: msg.trim(),
    };

    setMensagens(prev => [...prev, novaMensagemUsuario]);
    setTexto('');
    setEnviando(true);

    // Simula resposta do assistente após 1 segundo
    setTimeout(() => {
      const resposta = respostasSimuladas[Math.floor(Math.random() * respostasSimuladas.length)];
      const novaMensagemAssistente = {
        id: Date.now() + 1,
        tipo: 'assistente',
        texto: resposta,
      };
      setMensagens(prev => [...prev, novaMensagemAssistente]);
      setEnviando(false);

      // Rola para a última mensagem
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1000);

    // Rola imediatamente após enviar
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      {/* Header do assistente */}
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarEmoji}>🐾</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerNome}>Assistente PetFirst</Text>
          <View style={styles.headerStatus}>
            <View style={styles.statusDot} />
            <Text style={styles.headerStatusText}>online</Text>
          </View>
        </View>
      </View>

      {/* Chips de sugestão rápida */}
      <View style={styles.sugestoesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {sugestoes.map((s, i) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, i < sugestoes.length - 1 && styles.chipMargin]}
              onPress={() => enviarMensagem(s)}
            >
              <Text style={styles.chipText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de mensagens */}
      <ScrollView
        ref={scrollRef}
        style={styles.mensagensArea}
        contentContainerStyle={styles.mensagensConteudo}
        showsVerticalScrollIndicator={false}
      >
        {mensagens.map(msg => (
          <View
            key={msg.id}
            style={[
              styles.bolha,
              msg.tipo === 'usuario' ? styles.bolhaUsuario : styles.bolhaAssistente,
            ]}
          >
            {msg.tipo === 'assistente' && (
              <Text style={styles.bolhaAvatarEmoji}>🐾</Text>
            )}
            <View style={[
              styles.bolhaTextoContainer,
              msg.tipo === 'usuario' ? styles.bolhaTextoContainerUsuario : styles.bolhaTextoContainerAssistente,
            ]}>
              <Text style={[
                styles.bolhaTexto,
                msg.tipo === 'usuario' ? styles.bolhaTextoUsuario : styles.bolhaTextoAssistente,
              ]}>
                {msg.texto}
              </Text>
            </View>
          </View>
        ))}

        {/* Indicador de digitação */}
        {enviando && (
          <View style={[styles.bolha, styles.bolhaAssistente]}>
            <Text style={styles.bolhaAvatarEmoji}>🐾</Text>
            <View style={styles.bolhaDigitando}>
              <Text style={styles.bolhaDigitandoTexto}>digitando...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Disclaimer */}
      <Text style={styles.disclaimer}>Sempre consulte um veterinário para diagnósticos</Text>

      {/* Input de envio */}
      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          placeholder="Digite sua dúvida..."
          placeholderTextColor="#B8B0A8"
          value={texto}
          onChangeText={setTexto}
          multiline
          maxLength={500}
          onSubmitEditing={() => enviarMensagem()}
        />
        <TouchableOpacity
          style={[styles.btnEnviar, !texto.trim() && styles.btnEnviarDesabilitado]}
          onPress={() => enviarMensagem()}
          disabled={!texto.trim() || enviando}
        >
          <Text style={styles.btnEnviarIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E07B5A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  headerAvatarEmoji: {
    fontSize: 24,
  },
  headerInfo: {
    flex: 1,
  },
  headerNome: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFDF9',
    marginBottom: 4,
  },
  headerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#7BAE8A',
    marginRight: 6,
  },
  headerStatusText: {
    fontSize: 12,
    color: '#B8B0A8',
    fontWeight: '500',
  },
  sugestoesContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FAF6F1',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4DF',
  },
  chip: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#E07B5A',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  chipMargin: {
    marginRight: 8,
  },
  chipText: {
    fontSize: 13,
    color: '#E07B5A',
    fontWeight: '600',
  },
  mensagensArea: {
    flex: 1,
  },
  mensagensConteudo: {
    padding: 16,
    paddingBottom: 8,
  },
  bolha: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  bolhaUsuario: {
    justifyContent: 'flex-end',
  },
  bolhaAssistente: {
    justifyContent: 'flex-start',
  },
  bolhaAvatarEmoji: {
    fontSize: 20,
    marginRight: 8,
    marginBottom: 4,
  },
  bolhaTextoContainer: {
    maxWidth: '75%',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bolhaTextoContainerUsuario: {
    backgroundColor: '#E07B5A',
    borderBottomRightRadius: 4,
  },
  bolhaTextoContainerAssistente: {
    backgroundColor: '#FAF6F1',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#E8E4DF',
  },
  bolhaTexto: {
    fontSize: 15,
    lineHeight: 22,
  },
  bolhaTextoUsuario: {
    color: '#fff',
    fontWeight: '500',
  },
  bolhaTextoAssistente: {
    color: '#4A4540',
  },
  bolhaDigitando: {
    backgroundColor: '#FAF6F1',
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E8E4DF',
  },
  bolhaDigitandoTexto: {
    fontSize: 14,
    color: '#B8B0A8',
    fontStyle: 'italic',
  },
  disclaimer: {
    textAlign: 'center',
    fontSize: 11,
    color: '#B8B0A8',
    paddingHorizontal: 24,
    paddingVertical: 6,
    backgroundColor: '#FFFDF9',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E8E4DF',
  },
  input: {
    flex: 1,
    backgroundColor: '#FAF6F1',
    borderWidth: 2,
    borderColor: '#E8E4DF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: '#4A4540',
    maxHeight: 100,
    marginRight: 10,
  },
  btnEnviar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E07B5A',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E07B5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  btnEnviarDesabilitado: {
    backgroundColor: '#D3D1C7',
    shadowOpacity: 0,
  },
  btnEnviarIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});
