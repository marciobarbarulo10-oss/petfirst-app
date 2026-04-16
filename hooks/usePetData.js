import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { buscarPetsPorUsuario, criarPet, atualizarPet, verificarConexao, supabase } from '../lib/supabase';

// Chave usada para armazenar os dados do pet no AsyncStorage
const STORAGE_KEY = '@petfirst:pet';

// Estrutura padrão quando nenhum dado foi salvo ainda
const dadosPadrao = {
  id: null,
  petName: '',
  petEspecie: '',
  raca: '',
  idade: '',
  peso: '',
  foto: null,
};

export function usePetData() {
  const [petData, setPetData] = useState(dadosPadrao);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [online, setOnline] = useState(true);
  const [erro, setErro] = useState(null);

  // Carrega os dados ao montar (primeiro do cache, depois tenta Supabase)
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    setErro(null);

    try {
      // 1. Carrega do cache local primeiro (resposta rápida)
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json !== null) {
        const dadosLocais = JSON.parse(json);
        setPetData(dadosLocais);
      }

      // 2. Verifica conexão e tenta buscar do Supabase
      const conectado = await verificarConexao();
      setOnline(conectado);

      if (conectado) {
        // Verifica se há usuário autenticado
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Busca pets do usuário no servidor
          const { data: pets } = await buscarPetsPorUsuario(user.id);

          if (pets && pets.length > 0) {
            // Usa o primeiro pet (por enquanto app suporta 1 pet por usuário)
            const petServidor = pets[0];
            const dadosServidor = {
              id: petServidor.id,
              petName: petServidor.name,
              petEspecie: petServidor.especie,
              raca: petServidor.raca || '',
              idade: petServidor.idade || '',
              peso: petServidor.peso || '',
              foto: petServidor.foto_url,
            };

            // Atualiza estado e cache local
            setPetData(dadosServidor);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dadosServidor));
          }
        }
      }
    } catch (e) {
      console.warn('usePetData: erro ao carregar dados do pet', e);
      setErro('Não foi possível carregar os dados. Usando cache local.');
    } finally {
      setCarregando(false);
    }
  };

  // Salva um objeto parcial mesclando com os dados atuais
  const salvarPetData = useCallback(async (novosDados) => {
    setSalvando(true);
    setErro(null);

    try {
      const dadosAtualizados = { ...petData, ...novosDados };

      // 1. Salva no cache local imediatamente
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dadosAtualizados));
      setPetData(dadosAtualizados);

      // 2. Tenta salvar no Supabase se online
      const conectado = await verificarConexao();
      setOnline(conectado);

      if (conectado) {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const dadosParaServidor = {
            name: dadosAtualizados.petName,
            especie: dadosAtualizados.petEspecie,
            raca: dadosAtualizados.raca || null,
            idade: dadosAtualizados.idade || null,
            peso: dadosAtualizados.peso || null,
            foto_url: dadosAtualizados.foto || null,
          };

          if (dadosAtualizados.id) {
            // Atualiza pet existente
            const { data } = await atualizarPet(dadosAtualizados.id, dadosParaServidor);
            if (data) {
              dadosAtualizados.id = data.id;
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dadosAtualizados));
              setPetData(dadosAtualizados);
            }
          } else {
            // Cria novo pet
            const { data } = await criarPet({
              ...dadosParaServidor,
              user_id: user.id,
            });
            if (data) {
              dadosAtualizados.id = data.id;
              await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dadosAtualizados));
              setPetData(dadosAtualizados);
            }
          }
        }
      }

      return true;
    } catch (e) {
      console.warn('usePetData: erro ao salvar dados do pet', e);
      setErro('Dados salvos localmente. Serão sincronizados quando houver conexão.');
      return true; // Retorna true porque salvou localmente
    } finally {
      setSalvando(false);
    }
  }, [petData]);

  // Limpa todos os dados (útil para testes ou logout)
  const limparPetData = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setPetData(dadosPadrao);
    } catch (e) {
      console.warn('usePetData: erro ao limpar dados do pet', e);
    }
  }, []);

  // Força recarregamento dos dados
  const recarregar = useCallback(async () => {
    await carregarDados();
  }, []);

  // Limpa mensagem de erro
  const limparErro = useCallback(() => {
    setErro(null);
  }, []);

  return {
    petData,
    carregando,
    salvando,
    online,
    erro,
    salvarPetData,
    limparPetData,
    recarregar,
    limparErro,
  };
}
