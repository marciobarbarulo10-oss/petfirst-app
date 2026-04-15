import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chave usada para armazenar os dados do pet no AsyncStorage
const STORAGE_KEY = '@petfirst:pet';

// Estrutura padrão quando nenhum dado foi salvo ainda
const dadosPadrao = {
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

  // Carrega os dados do AsyncStorage ao montar
  useEffect(() => {
    async function carregar() {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json !== null) {
          setPetData(JSON.parse(json));
        }
      } catch (e) {
        console.warn('usePetData: erro ao carregar dados do pet', e);
      } finally {
        setCarregando(false);
      }
    }
    carregar();
  }, []);

  // Salva um objeto parcial mesclando com os dados atuais
  const salvarPetData = useCallback(async (novosDados) => {
    try {
      const dadosAtualizados = { ...petData, ...novosDados };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dadosAtualizados));
      setPetData(dadosAtualizados);
      return true;
    } catch (e) {
      console.warn('usePetData: erro ao salvar dados do pet', e);
      return false;
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

  return { petData, carregando, salvarPetData, limparPetData };
}
