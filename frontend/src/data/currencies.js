export const currencies = [
  { code: 'BRL', name: 'Real Brasileiro', symbol: 'R$', country: 'Brasil' },
  { code: 'USD', name: 'Dólar Americano', symbol: '$', country: 'Estados Unidos' },
  { code: 'EUR', name: 'Euro', symbol: '€', country: 'União Europeia' },
  { code: 'GBP', name: 'Libra Esterlina', symbol: '£', country: 'Reino Unido' },
  { code: 'JPY', name: 'Iene Japonês', symbol: '¥', country: 'Japão' },
  { code: 'CNY', name: 'Yuan Chinês', symbol: '¥', country: 'China' },
  { code: 'CHF', name: 'Franco Suíço', symbol: 'Fr', country: 'Suíça' },
  { code: 'CAD', name: 'Dólar Canadense', symbol: 'C$', country: 'Canadá' },
  { code: 'AUD', name: 'Dólar Australiano', symbol: 'A$', country: 'Austrália' },
  { code: 'NZD', name: 'Dólar Neozelandês', symbol: 'NZ$', country: 'Nova Zelândia' },
  { code: 'SEK', name: 'Coroa Sueca', symbol: 'kr', country: 'Suécia' },
  { code: 'NOK', name: 'Coroa Norueguesa', symbol: 'kr', country: 'Noruega' },
  { code: 'DKK', name: 'Coroa Dinamarquesa', symbol: 'kr', country: 'Dinamarca' },
  { code: 'PLN', name: 'Zloty Polonês', symbol: 'zł', country: 'Polônia' },
  { code: 'RUB', name: 'Rublo Russo', symbol: '₽', country: 'Rússia' },
  { code: 'INR', name: 'Rupia Indiana', symbol: '₹', country: 'Índia' },
  { code: 'KRW', name: 'Won Sul-Coreano', symbol: '₩', country: 'Coreia do Sul' },
  { code: 'SGD', name: 'Dólar de Singapura', symbol: 'S$', country: 'Singapura' },
  { code: 'HKD', name: 'Dólar de Hong Kong', symbol: 'HK$', country: 'Hong Kong' },
  { code: 'MXN', name: 'Peso Mexicano', symbol: '$', country: 'México' },
  { code: 'ARS', name: 'Peso Argentino', symbol: '$', country: 'Argentina' },
  { code: 'CLP', name: 'Peso Chileno', symbol: '$', country: 'Chile' },
  { code: 'COP', name: 'Peso Colombiano', symbol: '$', country: 'Colômbia' },
  { code: 'PEN', name: 'Sol Peruano', symbol: 'S/', country: 'Peru' },
  { code: 'ZAR', name: 'Rand Sul-Africano', symbol: 'R', country: 'África do Sul' },
  { code: 'TRY', name: 'Lira Turca', symbol: '₺', country: 'Turquia' },
  { code: 'ILS', name: 'Shekel Israelense', symbol: '₪', country: 'Israel' },
  { code: 'AED', name: 'Dirham dos Emirados', symbol: 'د.إ', country: 'Emirados Árabes' },
  { code: 'SAR', name: 'Riyal Saudita', symbol: '﷼', country: 'Arábia Saudita' },
  { code: 'THB', name: 'Baht Tailandês', symbol: '฿', country: 'Tailândia' },
  { code: 'IDR', name: 'Rupia Indonésia', symbol: 'Rp', country: 'Indonésia' },
  { code: 'MYR', name: 'Ringgit Malaio', symbol: 'RM', country: 'Malásia' },
  { code: 'PHP', name: 'Peso Filipino', symbol: '₱', country: 'Filipinas' },
  { code: 'VND', name: 'Dong Vietnamita', symbol: '₫', country: 'Vietnã' },
  { code: 'BTC', name: 'Bitcoin', symbol: '₿', country: 'Criptomoeda' },
  { code: 'ETH', name: 'Ethereum', symbol: 'Ξ', country: 'Criptomoeda' },
];

export const getCurrencyByCode = (code) => {
  return currencies.find(currency => currency.code === code) || currencies[0];
};

export const formatCurrency = (value, currencyCode = 'BRL') => {
  const currency = getCurrencyByCode(currencyCode);
  const formattedValue = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  
  return `${currency.symbol} ${formattedValue}`;
};

