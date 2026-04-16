import { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarVacinasPorPet, verificarConexao } from '../lib/supabase';

// Chave para cache local de vacinas
const VACINAS_STORAGE_KEY = '@petfirst:vacinas';
const PET_STORAGE_KEY = '@petfirst:pet';

export default function SaudeScreen({ route, navigation }) {
  const { petName, petEspecie } = route?.params || {};
  const emojis = { cachorro: '🐕', gato: '🐈', ave: '🐦', roedor: '🐹', reptil: '🦎', peixe: '🐠' };
  const emoji = emojis[petEspecie] || '🐾';

  // Estados
  const [vacinas, setVacinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [online, setOnline] = useState(true);
  const [erro, setErro] = useState(null);
  const [petId, setPetId] = useState(null);

  // Carrega vacinas ao montar e quando voltar da tela de adicionar
  useEffect(() => {
    carregarVacinas();

    // Recarrega quando a tela ganha foco (ex: volta de AdicionarVacina)
    const unsubscribe = navigation.addListener('focus', () => {
      carregarVacinas();
    });

    return unsubscribe;
  }, [navigation]);

  const carregarVacinas = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // 1. Busca o ID do pet do cache
      const petJson = await AsyncStorage.getItem(PET_STORAGE_KEY);
      let currentPetId = null;

      if (petJson) {
        const petData = JSON.parse(petJson);
        currentPetId = petData.id;
        setPetId(currentPetId);
      }

      // 2. Carrega vacinas do cache local primeiro (resposta rápida)
      const vacinasCache = await AsyncStorage.getItem(VACINAS_STORAGE_KEY);
      if (vacinasCache) {
        setVacinas(JSON.parse(vacinasCache));
      }

      // 3. Verifica conexão e tenta buscar do Supabase
      const conectado = await verificarConexao();
      setOnline(conectado);

      if (conectado && currentPetId) {
        const { data, error } = await buscarVacinasPorPet(currentPetId);

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const vacinasFormatadas = data.map(formatarVacinaDoServidor);
          setVacinas(vacinasFormatadas);
          await AsyncStorage.setItem(VACINAS_STORAGE_KEY, JSON.stringify(vacinasFormatadas));
        }
      } else if (!conectado && !vacinasCache) {
        // Se offline e sem cache, mostra dados de exemplo
        setVacinas(getVacinasExemplo());
      }
    } catch (error) {
      console.error('Erro ao carregar vacinas:', error);
      setErro('Não foi possível carregar as vacinas. Tente novamente.');

      // Se der erro e não tiver cache, mostra exemplos
      const vacinasCache = await AsyncStorage.getItem(VACINAS_STORAGE_KEY);
      if (!vacinasCache) {
        setVacinas(getVacinasExemplo());
      }
    } finally {
      setCarregando(false);
    }
  };

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setAtualizando(true);
    await carregarVacinas();
    setAtualizando(false);
  }, []);

  // Converte vacina do formato do servidor para o formato do app
  const formatarVacinaDoServidor = (vacina) => ({
    id: vacina.id,
    nome: vacina.nome,
    status: vacina.status || 'aplicada',
    data: formatarDataParaExibicao(vacina.data_aplicacao),
    clinica: vacina.clinica,
    observacoes: vacina.observacoes,
  });

  // Converte data de YYYY-MM-DD para DD/MM/AAAA
  const formatarDataParaExibicao = (dataStr) => {
    if (!dataStr) return '';
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  };

  // Dados de exemplo para quando não há dados reais
  const getVacinasExemplo = () => [
    { id: 'ex1', nome: 'Vacina V8', status: 'aplicada', data: '15/01/2026' },
    { id: 'ex2', nome: 'Antirrábica', status: 'aplicada', data: '20/02/2026' },
    { id: 'ex3', nome: 'V8 Reforço', status: 'proxima', data: '15/04/2026' },
    { id: 'ex4', nome: 'Vermífugo', status: 'proxima', data: '01/05/2026' },
  ];

  // Renderiza estado vazio
  const renderizarEstadoVazio = () => (
    <View style={styles.estadoVazio}>
      <Text style={styles.estadoVazioEmoji}>💉</Text>
      <Text style={styles.estadoVazioTitulo}>Nenhuma vacina registrada</Text>
      <Text style={styles.estadoVazioSub}>
        Adicione a primeira vacina de {petName || 'seu pet'} tocando no botão +
      </Text>
    </View>
  );

  // Renderiza indicador de carregamento
  const renderizarCarregando = () => (
    <View style={styles.carregandoContainer}>
      <ActivityIndicator size="large" color="#E07B5A" />
      <Text style={styles.carregandoTexto}>Carregando vacinas...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={onRefresh}
            colors={['#E07B5A']}
            tintColor="#E07B5A"
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitulo}>Saúde</Text>
            <Text style={styles.headerSub}>Carteirinha de {petName || 'seu pet'}</Text>
          </View>
          <TouchableOpacity
            style={styles.headerBtnAdd}
            onPress={() => navigation.navigate('AdicionarVacina', { petName, petEspecie, petId })}
          >
            <Text style={styles.headerBtnAddText}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          {/* Banner offline */}
          {!online && (
            <View style={styles.offlineBanner}>
              <Text style={styles.offlineText}>📶 Modo offline - dados locais</Text>
            </View>
          )}

          {/* Banner de erro */}
          {erro && (
            <TouchableOpacity style={styles.erroBanner} onPress={() => setErro(null)}>
              <Text style={styles.erroText}>⚠️ {erro}</Text>
              <Text style={styles.erroTextSub}>Toque para fechar</Text>
            </TouchableOpacity>
          )}

          {/* Card premium do pet */}
          <View style={styles.cardPet}>
            <View style={styles.fotoPet}>
              <Text style={styles.fotoPetEmoji}>{emoji}</Text>
            </View>
            <View style={styles.cardPetInfo}>
              <Text style={styles.cardPetNome}>{petName || 'Meu Pet'}</Text>
              <Text style={styles.cardPetEspecie}>
                {petEspecie ? petEspecie.charAt(0).toUpperCase() + petEspecie.slice(1) : 'Pet'}
              </Text>
              <View style={styles.cardPetBadge}>
                <Text style={styles.cardPetBadgeText}>Carteirinha ativa</Text>
              </View>
            </View>
          </View>

          {/* Seção de vacinas */}
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>Vacinas</Text>
            <Text style={styles.secaoContagem}>
              {vacinas.length} {vacinas.length === 1 ? 'registro' : 'registros'}
            </Text>
          </View>

          {/* Conteúdo das vacinas */}
          {carregando ? (
            renderizarCarregando()
          ) : vacinas.length === 0 ? (
            renderizarEstadoVazio()
          ) : (
            <View style={styles.timeline}>
              {vacinas.map((vacina, index) => (
                <View key={vacina.id} style={styles.timelineItem}>
                  {/* Linha vertical da timeline */}
                  <View style={styles.timelineEsquerda}>
                    <View
                      style={[
                        styles.timelinePonto,
                        vacina.status === 'proxima' && styles.timelinePontoProxima,
                      ]}
                    >
                      <Text style={styles.timelinePontoIcon}>
                        {vacina.status === 'aplicada' ? '✓' : '!'}
                      </Text>
                    </View>
                    {/* Linha conectando os pontos (exceto no último) */}
                    {index < vacinas.length - 1 && <View style={styles.timelineLinha} />}
                  </View>

                  {/* Conteúdo do item */}
                  <View
                    style={[
                      styles.timelineConteudo,
                      vacina.status === 'proxima' && styles.timelineConteudoProxima,
                    ]}
                  >
                    <View style={styles.timelineHeader}>
                      <Text
                        style={[
                          styles.timelineNome,
                          vacina.status === 'proxima' && styles.timelineNomeProxima,
                        ]}
                      >
                        {vacina.nome}
                      </Text>
                      <View
                        style={[
                          styles.timelineTag,
                          vacina.status === 'proxima' && styles.timelineTagProxima,
                        ]}
                      >
                        <Text
                          style={[
                            styles.timelineTagText,
                            vacina.status === 'proxima' && styles.timelineTagTextProxima,
                          ]}
                        >
                          {vacina.status === 'aplicada' ? 'Aplicada' : 'Próxima'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.timelineData}>{vacina.data}</Text>
                    {vacina.clinica && (
                      <Text style={styles.timelineClinica}>📍 {vacina.clinica}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB — botão flutuante para adicionar vacina */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('AdicionarVacina', { petName, petEspecie, petId })}
      >
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
  offlineBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F5C842',
  },
  offlineText: {
    fontSize: 13,
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
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
  secaoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#4A4540',
  },
  secaoContagem: {
    fontSize: 13,
    color: '#7A736C',
  },
  carregandoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  carregandoTexto: {
    marginTop: 16,
    fontSize: 14,
    color: '#7A736C',
  },
  estadoVazio: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  estadoVazioEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  estadoVazioTitulo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4A4540',
    marginBottom: 8,
    textAlign: 'center',
  },
  estadoVazioSub: {
    fontSize: 14,
    color: '#7A736C',
    textAlign: 'center',
    lineHeight: 20,
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
    flex: 1,
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
  timelineClinica: {
    fontSize: 12,
    color: '#7A736C',
    marginTop: 6,
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
