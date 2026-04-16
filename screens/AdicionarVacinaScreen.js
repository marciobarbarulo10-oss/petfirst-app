import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { adicionarVacina, verificarConexao } from '../lib/supabase';

// Chave para cache local de vacinas
const VACINAS_STORAGE_KEY = '@petfirst:vacinas';

// Tipos de vacina pré-definidos para facilitar o cadastro
const tiposVacina = [
  { id: 'v8', nome: 'Vacina V8/V10' },
  { id: 'antirrabica', nome: 'Antirrábica' },
  { id: 'vermifugo', nome: 'Vermífugo' },
  { id: 'giardia', nome: 'Giárdia' },
  { id: 'gripe', nome: 'Gripe Canina' },
  { id: 'leucemia', nome: 'Leucemia Felina' },
  { id: 'outra', nome: 'Outra' },
];

export default function AdicionarVacinaScreen({ navigation, route }) {
  const { petName, petId } = route?.params || {};

  const [tipoSelecionado, setTipoSelecionado] = useState(null);
  const [nomeCustomizado, setNomeCustomizado] = useState('');
  const [data, setData] = useState('');
  const [veterinario, setVeterinario] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [status, setStatus] = useState('aplicada'); // 'aplicada' ou 'proxima'
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState(null);

  // Formata a data enquanto digita (DD/MM/AAAA)
  const formatarData = (texto) => {
    const numeros = texto.replace(/\D/g, '');
    if (numeros.length <= 2) return numeros;
    if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
    return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4, 8)}`;
  };

  const handleDataChange = (texto) => {
    setData(formatarData(texto));
  };

  // Converte data de DD/MM/AAAA para YYYY-MM-DD
  const formatarDataParaServidor = (dataStr) => {
    const partes = dataStr.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return dataStr;
  };

  // Valida se a data é válida
  const validarData = (dataStr) => {
    if (dataStr.length !== 10) return false;
    const partes = dataStr.split('/');
    if (partes.length !== 3) return false;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const ano = parseInt(partes[2], 10);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) return false;
    if (dia < 1 || dia > 31) return false;
    if (mes < 1 || mes > 12) return false;
    if (ano < 2000 || ano > 2100) return false;

    return true;
  };

  const podeEnviar = tipoSelecionado && validarData(data) && (tipoSelecionado !== 'outra' || nomeCustomizado.trim());

  const handleSalvar = async () => {
    if (!podeEnviar) return;

    setSalvando(true);
    setErro(null);

    const nomeVacina = tipoSelecionado === 'outra'
      ? nomeCustomizado.trim()
      : tiposVacina.find(t => t.id === tipoSelecionado)?.nome;

    const novaVacina = {
      id: `local_${Date.now()}`,
      nome: nomeVacina,
      status,
      data,
      clinica: veterinario.trim() || null,
      observacoes: observacoes.trim() || null,
    };

    try {
      // 1. Salva no cache local primeiro (resposta rápida)
      const vacinasJson = await AsyncStorage.getItem(VACINAS_STORAGE_KEY);
      const vacinas = vacinasJson ? JSON.parse(vacinasJson) : [];
      const novasVacinas = [novaVacina, ...vacinas];
      await AsyncStorage.setItem(VACINAS_STORAGE_KEY, JSON.stringify(novasVacinas));

      // 2. Tenta salvar no Supabase se estiver online e tiver petId
      const conectado = await verificarConexao();

      if (conectado && petId) {
        const vacinaParaServidor = {
          pet_id: petId,
          nome: nomeVacina,
          data_aplicacao: formatarDataParaServidor(data),
          status,
          clinica: veterinario.trim() || null,
          observacoes: observacoes.trim() || null,
        };

        const { data: vacinaSalva, error } = await adicionarVacina(vacinaParaServidor);

        if (error) {
          console.warn('Erro ao salvar no servidor:', error);
          // Não impede a navegação - dados salvos localmente
          mostrarSucessoOffline();
        } else if (vacinaSalva) {
          // Atualiza o cache com o ID real do servidor
          const vacinasAtualizadas = novasVacinas.map(v =>
            v.id === novaVacina.id
              ? { ...v, id: vacinaSalva.id }
              : v
          );
          await AsyncStorage.setItem(VACINAS_STORAGE_KEY, JSON.stringify(vacinasAtualizadas));
        }
      } else if (!conectado) {
        mostrarSucessoOffline();
      }

      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar vacina:', error);
      setErro('Não foi possível salvar a vacina. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

  const mostrarSucessoOffline = () => {
    Alert.alert(
      'Salvo localmente',
      'A vacina foi salva no seu dispositivo e será sincronizada quando houver conexão.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.btnVoltar}
          disabled={salvando}
        >
          <Text style={styles.btnVoltarText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitulo}>Nova Vacina</Text>
          <Text style={styles.headerSub}>Registrar para {petName || 'seu pet'}</Text>
        </View>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
        {/* Banner de erro */}
        {erro && (
          <TouchableOpacity style={styles.erroBanner} onPress={() => setErro(null)}>
            <Text style={styles.erroText}>⚠️ {erro}</Text>
            <Text style={styles.erroTextSub}>Toque para fechar</Text>
          </TouchableOpacity>
        )}

        {/* Status da vacina */}
        <Text style={styles.label}>Status</Text>
        <View style={styles.statusContainer}>
          <TouchableOpacity
            style={[styles.statusBtn, status === 'aplicada' && styles.statusBtnAtivo]}
            onPress={() => setStatus('aplicada')}
            disabled={salvando}
          >
            <Text style={[styles.statusBtnText, status === 'aplicada' && styles.statusBtnTextAtivo]}>
              ✓ Já aplicada
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.statusBtn, styles.statusBtnDireito, status === 'proxima' && styles.statusBtnProxima]}
            onPress={() => setStatus('proxima')}
            disabled={salvando}
          >
            <Text style={[styles.statusBtnText, status === 'proxima' && styles.statusBtnTextProxima]}>
              📅 Agendar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tipo de vacina */}
        <Text style={styles.label}>Tipo de vacina</Text>
        <View style={styles.tiposGrid}>
          {tiposVacina.map((tipo) => (
            <TouchableOpacity
              key={tipo.id}
              style={[
                styles.tipoBtn,
                tipoSelecionado === tipo.id && styles.tipoBtnSelecionado,
              ]}
              onPress={() => setTipoSelecionado(tipo.id)}
              disabled={salvando}
            >
              <Text style={[
                styles.tipoBtnText,
                tipoSelecionado === tipo.id && styles.tipoBtnTextSelecionado,
              ]}>
                {tipo.nome}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Campo customizado se selecionou "Outra" */}
        {tipoSelecionado === 'outra' && (
          <>
            <Text style={styles.label}>Nome da vacina</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome da vacina"
              placeholderTextColor="#B8B0A8"
              value={nomeCustomizado}
              onChangeText={setNomeCustomizado}
              editable={!salvando}
            />
          </>
        )}

        {/* Data */}
        <Text style={styles.label}>
          {status === 'aplicada' ? 'Data de aplicação' : 'Data agendada'}
        </Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#B8B0A8"
          value={data}
          onChangeText={handleDataChange}
          keyboardType="numeric"
          maxLength={10}
          editable={!salvando}
        />

        {/* Veterinário (opcional) */}
        <Text style={styles.label}>Veterinário (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome do veterinário ou clínica"
          placeholderTextColor="#B8B0A8"
          value={veterinario}
          onChangeText={setVeterinario}
          editable={!salvando}
        />

        {/* Observações (opcional) */}
        <Text style={styles.label}>Observações (opcional)</Text>
        <TextInput
          style={[styles.input, styles.inputMultiline]}
          placeholder="Reações, lote, próxima dose..."
          placeholderTextColor="#B8B0A8"
          value={observacoes}
          onChangeText={setObservacoes}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          editable={!salvando}
        />

        {/* Espaço para o botão não sobrepor */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Botão salvar fixo no rodapé */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btnSalvar, (!podeEnviar || salvando) && styles.btnSalvarDesabilitado]}
          onPress={handleSalvar}
          disabled={!podeEnviar || salvando}
        >
          {salvando ? (
            <View style={styles.btnSalvarConteudo}>
              <ActivityIndicator size="small" color="#fff" />
              <Text style={styles.btnSalvarTextSalvando}>Salvando...</Text>
            </View>
          ) : (
            <Text style={styles.btnSalvarText}>Salvar vacina</Text>
          )}
        </TouchableOpacity>
      </View>
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
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnVoltar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnVoltarText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitulo: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFDF9',
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 13,
    color: '#B8B0A8',
  },
  headerPlaceholder: {
    width: 40,
  },
  body: {
    flex: 1,
    padding: 24,
  },
  erroBanner: {
    backgroundColor: '#FFE5E0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E07B5A',
  },
  erroText: {
    fontSize: 13,
    color: '#C23D1E',
    fontWeight: '600',
  },
  erroTextSub: {
    fontSize: 11,
    color: '#C23D1E',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4A4540',
    marginBottom: 10,
    marginTop: 20,
  },
  statusContainer: {
    flexDirection: 'row',
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    backgroundColor: '#fff',
    alignItems: 'center',
    marginRight: 12,
  },
  statusBtnDireito: {
    marginRight: 0,
  },
  statusBtnAtivo: {
    borderColor: '#7BAE8A',
    backgroundColor: 'rgba(123,174,138,0.1)',
  },
  statusBtnProxima: {
    borderColor: '#E07B5A',
    backgroundColor: 'rgba(224,123,90,0.1)',
  },
  statusBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A736C',
  },
  statusBtnTextAtivo: {
    color: '#7BAE8A',
  },
  statusBtnTextProxima: {
    color: '#E07B5A',
  },
  tiposGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tipoBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#E8E4DF',
    backgroundColor: '#fff',
    marginRight: 10,
    marginBottom: 10,
  },
  tipoBtnSelecionado: {
    borderColor: '#E07B5A',
    backgroundColor: '#E07B5A',
  },
  tipoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4A4540',
  },
  tipoBtnTextSelecionado: {
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E8E4DF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#4A4540',
  },
  inputMultiline: {
    minHeight: 80,
    paddingTop: 14,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    backgroundColor: '#FFFDF9',
    borderTopWidth: 1,
    borderTopColor: '#E8E4DF',
  },
  btnSalvar: {
    backgroundColor: '#E07B5A',
    paddingVertical: 18,
    borderRadius: 100,
    alignItems: 'center',
    shadowColor: '#E07B5A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  btnSalvarDesabilitado: {
    backgroundColor: '#D3D1C7',
    shadowOpacity: 0,
  },
  btnSalvarConteudo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  btnSalvarText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  btnSalvarTextSalvando: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
