import api from './api';

/**
 * Busca todos os investimentos disponíveis do backend
 * @returns {Promise<Array>} Lista de investimentos disponíveis
 */
export const getAvailableInvestments = async () => {
  try {
    const response = await api.get('/investimentos');
    return response.data.data || [];
  } catch (error) {
    console.error('Erro ao buscar investimentos disponíveis:', error);
    return [];
  }
};

/**
 * Busca investimento por ticker
 * @param {string} ticker - Ticker do investimento
 * @returns {Promise<Object|null>} Dados do investimento ou null
 */
export const getInvestmentByTicker = async (ticker) => {
  try {
    const response = await api.get(`/investimentos/${ticker}`);
    return response.data.data || null;
  } catch (error) {
    console.error('Erro ao buscar investimento por ticker:', error);
    return null;
  }
};

/**
 * Mapeia tipo do backend para tipo do sistema
 * @param {string} backendType - Tipo do backend (FII, AÇÃO, ETF, CRIPTO)
 * @returns {string} Tipo mapeado (retorna o mesmo tipo do backend)
 */
export const mapBackendTypeToSystemType = (backendType) => {
  // Retorna o tipo do backend sem conversão
  return backendType;
};

/**
 * Busca investimento completo por string de sugestão
 * @param {string} suggestion - String no formato "TICKER - Nome"
 * @returns {Promise<Object|null>} Dados do investimento ou null
 */
export const getInvestmentFromSuggestion = async (suggestion) => {
  try {
    // Extrai o ticker da sugestão (formato: "MXRF11 - Nome")
    const ticker = suggestion.split(' - ')[0]?.trim();
    if (!ticker) return null;

    const investment = await getInvestmentByTicker(ticker);
    if (investment) {
      return {
        ...investment,
        tipo: mapBackendTypeToSystemType(investment.tipo),
      };
    }
    return null;
  } catch (error) {
    console.error('Erro ao buscar investimento da sugestão:', error);
    return null;
  }
};

/**
 * Busca investimentos por tipo
 * @param {string} tipo - Tipo do investimento (FII, AÇÃO, ETF, CRIPTO)
 * @returns {Promise<Array>} Lista de investimentos do tipo
 */
export const getInvestmentsByType = async (tipo) => {
  try {
    const response = await api.get(`/investimentos/tipo/${tipo}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Erro ao buscar investimentos por tipo:', error);
    return [];
  }
};

/**
 * Busca investimentos por país
 * @param {string} pais - País (BR ou US)
 * @returns {Promise<Array>} Lista de investimentos do país
 */
export const getInvestmentsByCountry = async (pais) => {
  try {
    const response = await api.get(`/investimentos/pais/${pais}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Erro ao buscar investimentos por país:', error);
    return [];
  }
};

/**
 * Busca sugestões de investimentos (combina backend + API externa)
 * @param {string} search - Termo de busca
 * @returns {Promise<Array>} Lista de sugestões
 */
export const searchInvestmentSuggestions = async (search) => {
  if (!search || search.length < 2) {
    // Se não há busca, retorna alguns investimentos populares do backend
    try {
      const availableInvestments = await getAvailableInvestments();
      return availableInvestments
        .slice(0, 10)
        .map(inv => `${inv.ticker} - ${inv.nome}`);
    } catch (error) {
      return [];
    }
  }

  const searchLower = search.toLowerCase();
  const results = [];

  try {
    // Busca no backend primeiro
    const availableInvestments = await getAvailableInvestments();
    const backendMatches = availableInvestments
      .filter(inv => 
        inv.nome.toLowerCase().includes(searchLower) ||
        inv.ticker.toLowerCase().includes(searchLower)
      )
      .slice(0, 5)
      .map(inv => `${inv.ticker} - ${inv.nome}`);

    results.push(...backendMatches);
  } catch (error) {
    console.error('Erro ao buscar no backend:', error);
  }

  // Se não encontrou no backend, busca na API externa (brapi)
  if (results.length < 5) {
    try {
      const { searchStocks } = await import('./financialApi');
      const stocks = await searchStocks(search);
      const stockSuggestions = stocks
        .slice(0, 5 - results.length)
        .map(stock => {
          const code = typeof stock === 'string' ? stock : stock.code || stock.symbol || stock.name;
          return code ? `${code} - Ação` : null;
        })
        .filter(Boolean);
      
      results.push(...stockSuggestions);
    } catch (error) {
      console.error('Erro ao buscar ações na API:', error);
    }
  }

  return results;
};

/**
 * Busca tipos de investimento disponíveis no backend
 * @returns {Promise<Array>} Lista de tipos únicos
 */
export const getAvailableTypes = async () => {
  try {
    const investments = await getAvailableInvestments();
    const types = [...new Set(investments.map(inv => inv.tipo))];
    return types.sort();
  } catch (error) {
    console.error('Erro ao buscar tipos:', error);
    return [];
  }
};

/**
 * Busca sugestões de tipos de investimento
 * @param {string} search - Termo de busca
 * @returns {Promise<Array>} Lista de tipos sugeridos
 */
export const searchInvestmentTypes = async (search) => {
  try {
    const types = await getAvailableTypes();
    
    if (!search || search.length < 1) {
      return types.slice(0, 10);
    }

    const searchLower = search.toLowerCase();
    return types.filter(type =>
      type.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error('Erro ao buscar tipos:', error);
    return [];
  }
};

