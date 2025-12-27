import axios from 'axios';

// API brapi - Dados financeiros brasileiros
const BRAPI_BASE_URL = 'https://brapi.dev/api';

/**
 * Busca a taxa CDI atual
 * @returns {Promise<number>} Taxa CDI mensal em porcentagem
 */
export const getCDIRate = async () => {
  try {
    const response = await axios.get(`${BRAPI_BASE_URL}/cdi`);
    // A API retorna a taxa CDI anual, convertemos para mensal aproximada
    const annualRate = response.data?.cdi || 0;
    // Aproximação: taxa mensal ≈ (1 + taxa anual)^(1/12) - 1
    const monthlyRate = (Math.pow(1 + annualRate / 100, 1 / 12) - 1) * 100;
    return monthlyRate.toFixed(2);
  } catch (error) {
    console.error('Erro ao buscar taxa CDI:', error);
    return null;
  }
};

/**
 * Busca taxa Selic atual
 * @returns {Promise<number>} Taxa Selic anual em porcentagem
 */
export const getSelicRate = async () => {
  try {
    const response = await axios.get(`${BRAPI_BASE_URL}/selic`);
    const annualRate = response.data?.selic || 0;
    // Convertendo para mensal
    const monthlyRate = (Math.pow(1 + annualRate / 100, 1 / 12) - 1) * 100;
    return monthlyRate.toFixed(2);
  } catch (error) {
    console.error('Erro ao buscar taxa Selic:', error);
    return null;
  }
};

/**
 * Busca lista de ações disponíveis
 * @param {string} search - Termo de busca
 * @returns {Promise<Array>} Lista de ações
 */
export const searchStocks = async (search) => {
  try {
    const response = await axios.get(`${BRAPI_BASE_URL}/available`, {
      params: {
        search,
      },
    });
    // A API pode retornar diferentes formatos
    if (Array.isArray(response.data)) {
      return response.data;
    }
    if (response.data?.stocks) {
      return response.data.stocks;
    }
    if (response.data?.results) {
      return response.data.results;
    }
    return [];
  } catch (error) {
    console.error('Erro ao buscar ações:', error);
    return [];
  }
};

/**
 * Detecta tipo de investimento baseado no nome
 * @param {string} name - Nome do investimento
 * @returns {string} Tipo detectado
 */
export const detectInvestmentType = (name) => {
  if (!name) return '';
  
  const nameLower = name.toLowerCase();
  
  // Ações e FIIs
  if (nameLower.match(/\b([a-z]{4}\d{1,2})\b/)) {
    // Código de ação (ex: PETR4, MXRF11)
    if (nameLower.includes('11') || nameLower.includes('fii') || nameLower.includes('fundos imobiliários')) {
      return 'FII';
    }
    return 'Ações';
  }
  
  // CDBs
  if (nameLower.includes('cdb')) return 'CDB';
  
  // LCIs
  if (nameLower.includes('lci')) return 'LCI';
  
  // LCAs
  if (nameLower.includes('lca')) return 'LCA';
  
  // Tesouro
  if (nameLower.includes('tesouro')) {
    if (nameLower.includes('selic')) return 'Tesouro Selic';
    if (nameLower.includes('ipca')) return 'Tesouro IPCA+';
    if (nameLower.includes('prefixado')) return 'Tesouro Prefixado';
    return 'Tesouro Direto';
  }
  
  // Contas Remuneradas
  if (nameLower.includes('conta remunerada')) return 'Conta Remunerada';
  
  // Fundos
  if (nameLower.includes('fundo')) {
    if (nameLower.includes('di')) return 'Fundo DI';
    if (nameLower.includes('multimercado')) return 'Fundo Multimercado';
    if (nameLower.includes('renda fixa')) return 'Fundo Renda Fixa';
    if (nameLower.includes('ações')) return 'Fundo Ações';
    if (nameLower.includes('imobiliário')) return 'FII';
    return 'Fundo DI';
  }
  
  // Criptomoedas
  if (nameLower.includes('bitcoin') || nameLower.includes('btc') || 
      nameLower.includes('ethereum') || nameLower.includes('eth') ||
      nameLower.includes('cripto')) return 'Criptomoedas';
  
  // Outros
  if (nameLower.includes('debênture')) return 'Debêntures';
  if (nameLower.includes('coe')) return 'COE';
  if (nameLower.includes('poupança')) return 'Poupança';
  if (nameLower.includes('previdência')) return 'Previdência Privada';
  
  return '';
};

/**
 * Sugere taxa baseada no tipo de investimento
 * @param {string} investmentType - Tipo do investimento
 * @returns {Promise<number|null>} Taxa sugerida mensal
 */
export const suggestRateByType = async (investmentType) => {
  const type = investmentType?.toLowerCase() || '';
  
  // Se for CDB, busca CDI
  if (type.includes('cdb') || type.includes('lci') || type.includes('lca')) {
    return await getCDIRate();
  }
  
  // Se for Tesouro, busca Selic
  if (type.includes('tesouro') || type.includes('selic')) {
    return await getSelicRate();
  }
  
  // Outros tipos podem ter taxas padrão
  return null;
};

/**
 * Busca sugestões de investimentos (mantido para compatibilidade)
 * Agora usa o investmentsApi que busca do backend
 * @param {string} search - Termo de busca
 * @returns {Promise<Array>} Lista de sugestões
 */
export const searchInvestmentSuggestions = async (search) => {
  // Redireciona para o novo serviço
  const { searchInvestmentSuggestions: newSearch } = await import('./investmentsApi');
  return newSearch(search);
};

/**
 * Busca sugestões de tipos de investimento (mantido para compatibilidade)
 * Agora usa o investmentsApi que busca do backend
 * @param {string} search - Termo de busca
 * @returns {Promise<Array>} Lista de tipos sugeridos
 */
export const searchInvestmentTypes = async (search) => {
  // Redireciona para o novo serviço
  const { searchInvestmentTypes: newSearch } = await import('./investmentsApi');
  return newSearch(search);
};
