import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  supabase,
  buscarVacinasPorPet,
  adicionarVacina as adicionarVacinaSupabase,
  atualizarVacina as atualizarVacinaSupabase,
  removerVacina as removerVacinaSupabase,
  buscarLembretesPorPet,
  criarPet,
  atualizarPet,
  verificarConexao,
} from '../lib/supabase';

// Chaves para AsyncStorage (cache offline)
const STORAGE_KEYS = {
  PET: '@petfirst:pet',
  VACINAS: '@petfirst:vacinas',
  LEMBRETES: '@petfirst:lembretes',
  PENDING_SYNC: '@petfirst:pending_sync',
};

// Dados padrão quando não há nada salvo
const dadosPadraoPet = {
  id: null,
  petName: '',
  petEspecie: '',
  raca: '',
  idade: '',
  peso: '',
  foto: null,
};

// Cria o contexto
const PetContext = createContext(null);

// Hook para usar o contexto
export function usePet() {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePet deve ser usado dentro de um PetProvider');
  }
  return context;
}

// Provider que envolve a aplicação
export function PetProvider({ children }) {
  // Estado do pet
  const [pet, setPet] = useState(dadosPadraoPet);
  const [vacinas, setVacinas] = useState([]);
  const [lembretes, setLembretes] = useState([]);

  // Estados de controle
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [online, setOnline] = useState(true);
  const [erro, setErro] = useState(null);

  // ============================================
  // CARREGAMENTO INICIAL
  // ============================================

  useEffect(() => {
    carregarDadosIniciais();
  }, []);

  const carregarDadosIniciais = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // Primeiro, carrega do cache local (resposta rápida)
      await carregarDoCache();

      // Depois, tenta sincronizar com Supabase
      const conectado = await verificarConexao();
      setOnline(conectado);

      if (conectado && pet.id) {
        await sincronizarComSupabase();
      }
    } catch (error) {
      console.error('Erro ao carregar dados iniciais:', error);
      setErro('Não foi possível carregar os dados. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  // Carrega dados do AsyncStorage (cache offline)
  const carregarDoCache = async () => {
    try {
      const [petJson, vacinasJson, lembretesJson] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.PET),
        AsyncStorage.getItem(STORAGE_KEYS.VACINAS),
        AsyncStorage.getItem(STORAGE_KEYS.LEMBRETES),
      ]);

      if (petJson) {
        setPet(JSON.parse(petJson));
      }
      if (vacinasJson) {
        setVacinas(JSON.parse(vacinasJson));
      }
      if (lembretesJson) {
        setLembretes(JSON.parse(lembretesJson));
      }
    } catch (error) {
      console.error('Erro ao carregar cache:', error);
    }
  };

  // Sincroniza com o Supabase
  const sincronizarComSupabase = async () => {
    if (!pet.id) return;

    try {
      // Busca vacinas e lembretes do servidor
      const [vacinasResult, lembretesResult] = await Promise.all([
        buscarVacinasPorPet(pet.id),
        buscarLembretesPorPet(pet.id),
      ]);

      if (vacinasResult.data) {
        const vacinasFormatadas = vacinasResult.data.map(formatarVacinaDoServidor);
        setVacinas(vacinasFormatadas);
        await AsyncStorage.setItem(STORAGE_KEYS.VACINAS, JSON.stringify(vacinasFormatadas));
      }

      if (lembretesResult.data) {
        setLembretes(lembretesResult.data);
        await AsyncStorage.setItem(STORAGE_KEYS.LEMBRETES, JSON.stringify(lembretesResult.data));
      }

      // Sincroniza operações pendentes (se houver)
      await sincronizarPendentes();
    } catch (error) {
      console.error('Erro ao sincronizar com Supabase:', error);
    }
  };

  // ============================================
  // FUNÇÕES DO PET
  // ============================================

  const salvarPet = useCallback(async (novosDados) => {
    setSalvando(true);
    setErro(null);

    try {
      const dadosAtualizados = { ...pet, ...novosDados };

      // Salva no cache local imediatamente
      await AsyncStorage.setItem(STORAGE_KEYS.PET, JSON.stringify(dadosAtualizados));
      setPet(dadosAtualizados);

      // Se estiver online, salva no Supabase
      const conectado = await verificarConexao();
      setOnline(conectado);

      if (conectado) {
        if (dadosAtualizados.id) {
          // Atualiza pet existente
          await atualizarPet(dadosAtualizados.id, {
            name: dadosAtualizados.petName,
            especie: dadosAtualizados.petEspecie,
            raca: dadosAtualizados.raca,
            idade: dadosAtualizados.idade,
            peso: dadosAtualizados.peso,
            foto_url: dadosAtualizados.foto,
          });
        }
        // Criar novo pet requer autenticação, será feito no fluxo de cadastro
      }

      return true;
    } catch (error) {
      console.error('Erro ao salvar pet:', error);
      setErro('Erro ao salvar dados do pet. Tente novamente.');
      return false;
    } finally {
      setSalvando(false);
    }
  }, [pet]);

  const limparPet = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(STORAGE_KEYS.PET),
        AsyncStorage.removeItem(STORAGE_KEYS.VACINAS),
        AsyncStorage.removeItem(STORAGE_KEYS.LEMBRETES),
      ]);
      setPet(dadosPadraoPet);
      setVacinas([]);
      setLembretes([]);
    } catch (error) {
      console.error('Erro ao limpar dados:', error);
    }
  }, []);

  // ============================================
  // FUNÇÕES DE VACINAS
  // ============================================

  // Converte vacina do formato do servidor para o formato do app
  const formatarVacinaDoServidor = (vacina) => ({
    id: vacina.id,
    nome: vacina.nome,
    status: vacina.status,
    data: formatarDataParaExibicao(vacina.data_aplicacao),
    dataRaw: vacina.data_aplicacao,
    proximaData: vacina.proxima_data,
    clinica: vacina.clinica,
    observacoes: vacina.observacoes,
  });

  // Converte data de DD/MM/AAAA para YYYY-MM-DD
  const formatarDataParaServidor = (dataStr) => {
    const partes = dataStr.split('/');
    if (partes.length === 3) {
      return `${partes[2]}-${partes[1]}-${partes[0]}`;
    }
    return dataStr;
  };

  // Converte data de YYYY-MM-DD para DD/MM/AAAA
  const formatarDataParaExibicao = (dataStr) => {
    if (!dataStr) return '';
    const partes = dataStr.split('-');
    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }
    return dataStr;
  };

  const adicionarVacina = useCallback(async (novaVacina) => {
    setSalvando(true);
    setErro(null);

    try {
      const vacinaLocal = {
        id: `local_${Date.now()}`,
        nome: novaVacina.nome,
        status: novaVacina.status,
        data: novaVacina.data,
        clinica: novaVacina.veterinario || novaVacina.clinica,
        observacoes: novaVacina.observacoes,
        pendingSync: true,
      };

      // Adiciona localmente primeiro (resposta rápida)
      const novasVacinas = [vacinaLocal, ...vacinas];
      setVacinas(novasVacinas);
      await AsyncStorage.setItem(STORAGE_KEYS.VACINAS, JSON.stringify(novasVacinas));

      // Se estiver online e tiver pet.id, salva no Supabase
      const conectado = await verificarConexao();
      setOnline(conectado);

      if (conectado && pet.id) {
        const vacinaParaServidor = {
          pet_id: pet.id,
          nome: novaVacina.nome,
          data_aplicacao: formatarDataParaServidor(novaVacina.data),
          status: novaVacina.status,
          clinica: novaVacina.veterinario || novaVacina.clinica || null,
          observacoes: novaVacina.observacoes || null,
        };

        const { data, error } = await adicionarVacinaSupabase(vacinaParaServidor);

        if (error) throw error;

        // Atualiza o ID local com o ID real do servidor
        const vacinasAtualizadas = novasVacinas.map((v) =>
          v.id === vacinaLocal.id
            ? { ...formatarVacinaDoServidor(data), pendingSync: false }
            : v
        );
        setVacinas(vacinasAtualizadas);
        await AsyncStorage.setItem(STORAGE_KEYS.VACINAS, JSON.stringify(vacinasAtualizadas));
      } else if (!conectado) {
        // Salva para sincronização posterior
        await adicionarOperacaoPendente('adicionar_vacina', novaVacina);
      }

      return true;
    } catch (error) {
      console.error('Erro ao adicionar vacina:', error);
      setErro('Erro ao adicionar vacina. Ela foi salva localmente e será sincronizada depois.');
      return true; // Retorna true porque salvou localmente
    } finally {
      setSalvando(false);
    }
  }, [vacinas, pet.id]);

  const atualizarVacinaLocal = useCallback(async (vacinaId, dados) => {
    setSalvando(true);

    try {
      const vacinasAtualizadas = vacinas.map((v) =>
        v.id === vacinaId ? { ...v, ...dados } : v
      );
      setVacinas(vacinasAtualizadas);
      await AsyncStorage.setItem(STORAGE_KEYS.VACINAS, JSON.stringify(vacinasAtualizadas));

      const conectado = await verificarConexao();
      if (conectado && !vacinaId.startsWith('local_')) {
        await atualizarVacinaSupabase(vacinaId, dados);
      }

      return true;
    } catch (error) {
      console.error('Erro ao atualizar vacina:', error);
      return false;
    } finally {
      setSalvando(false);
    }
  }, [vacinas]);

  const removerVacinaLocal = useCallback(async (vacinaId) => {
    setSalvando(true);

    try {
      const vacinasFiltradas = vacinas.filter((v) => v.id !== vacinaId);
      setVacinas(vacinasFiltradas);
      await AsyncStorage.setItem(STORAGE_KEYS.VACINAS, JSON.stringify(vacinasFiltradas));

      const conectado = await verificarConexao();
      if (conectado && !vacinaId.startsWith('local_')) {
        await removerVacinaSupabase(vacinaId);
      }

      return true;
    } catch (error) {
      console.error('Erro ao remover vacina:', error);
      return false;
    } finally {
      setSalvando(false);
    }
  }, [vacinas]);

  // ============================================
  // SINCRONIZAÇÃO OFFLINE
  // ============================================

  const adicionarOperacaoPendente = async (tipo, dados) => {
    try {
      const pendingJson = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      const pending = pendingJson ? JSON.parse(pendingJson) : [];
      pending.push({ tipo, dados, timestamp: Date.now() });
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SYNC, JSON.stringify(pending));
    } catch (error) {
      console.error('Erro ao salvar operação pendente:', error);
    }
  };

  const sincronizarPendentes = async () => {
    try {
      const pendingJson = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SYNC);
      if (!pendingJson) return;

      const pending = JSON.parse(pendingJson);
      if (pending.length === 0) return;

      // Processa cada operação pendente
      for (const operacao of pending) {
        if (operacao.tipo === 'adicionar_vacina' && pet.id) {
          const vacinaParaServidor = {
            pet_id: pet.id,
            nome: operacao.dados.nome,
            data_aplicacao: formatarDataParaServidor(operacao.dados.data),
            status: operacao.dados.status,
            clinica: operacao.dados.veterinario || null,
            observacoes: operacao.dados.observacoes || null,
          };
          await adicionarVacinaSupabase(vacinaParaServidor);
        }
      }

      // Limpa as operações pendentes
      await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_SYNC);

      // Recarrega os dados do servidor
      await sincronizarComSupabase();
    } catch (error) {
      console.error('Erro ao sincronizar pendentes:', error);
    }
  };

  // ============================================
  // FUNÇÕES DE REFRESH
  // ============================================

  const recarregarVacinas = useCallback(async () => {
    if (!pet.id) return;

    setCarregando(true);
    try {
      const conectado = await verificarConexao();
      setOnline(conectado);

      if (conectado) {
        const { data } = await buscarVacinasPorPet(pet.id);
        if (data) {
          const vacinasFormatadas = data.map(formatarVacinaDoServidor);
          setVacinas(vacinasFormatadas);
          await AsyncStorage.setItem(STORAGE_KEYS.VACINAS, JSON.stringify(vacinasFormatadas));
        }
      }
    } catch (error) {
      console.error('Erro ao recarregar vacinas:', error);
    } finally {
      setCarregando(false);
    }
  }, [pet.id]);

  // ============================================
  // VALOR DO CONTEXTO
  // ============================================

  const value = {
    // Estado do pet
    pet,
    vacinas,
    lembretes,

    // Estados de controle
    carregando,
    salvando,
    online,
    erro,

    // Funções do pet
    salvarPet,
    limparPet,

    // Funções de vacinas
    adicionarVacina,
    atualizarVacina: atualizarVacinaLocal,
    removerVacina: removerVacinaLocal,
    recarregarVacinas,

    // Utilitários
    sincronizarComSupabase,
    limparErro: () => setErro(null),
  };

  return <PetContext.Provider value={value}>{children}</PetContext.Provider>;
}
