const investments = [
  // FIIs BRASILEIROS (30)
  {
    id: 1,
    nome: 'Maxi Renda Fundo de Investimento Imobiliário',
    ticker: 'MXRF11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/max-renda--big.svg'
  },
  {
    id: 2,
    nome: 'CSHG Logística Fundo de Investimento Imobiliário',
    ticker: 'HGLG11',
    tipo: 'FII',
    categoria: 'Logística',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/cshg-logistica--big.svg'
  },
  {
    id: 3,
    nome: 'XP Malls Fundo de Investimento Imobiliário',
    ticker: 'XPML11',
    tipo: 'FII',
    categoria: 'Shopping',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/xp-malls--big.svg'
  },
  {
    id: 4,
    nome: 'Vinci Shopping Centers Fundo de Investimento Imobiliário',
    ticker: 'VISC11',
    tipo: 'FII',
    categoria: 'Shopping',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/vinci-shopping--big.svg'
  },
  {
    id: 5,
    nome: 'XP Log Fundo de Investimento Imobiliário',
    ticker: 'XPLG11',
    tipo: 'FII',
    categoria: 'Logística',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/xp-log--big.svg'
  },
  {
    id: 6,
    nome: 'Hedge Shopping Centers Fundo de Investimento Imobiliário',
    ticker: 'HGBS11',
    tipo: 'FII',
    categoria: 'Shopping',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/hedge-shopping--big.svg'
  },
  {
    id: 7,
    nome: 'BTG Pactual Logística Fundo de Investimento Imobiliário',
    ticker: 'BTLG11',
    tipo: 'FII',
    categoria: 'Logística',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/btg-pactual-logistica--big.svg'
  },
  {
    id: 8,
    nome: 'Kinea Rendimentos Imobiliários Fundo de Investimento Imobiliário',
    ticker: 'KNRI11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/kinea-rendimentos--big.svg'
  },
  {
    id: 9,
    nome: 'Votorantim Logística Fundo de Investimento Imobiliário',
    ticker: 'VTLT11',
    tipo: 'FII',
    categoria: 'Logística',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/votorantim-logistica--big.svg'
  },
  {
    id: 10,
    nome: 'CSHG Real Estate Fundo de Investimento Imobiliário',
    ticker: 'HGRE11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/cshg-real-estate--big.svg'
  },
  {
    id: 11,
    nome: 'Housi Fundo de Investimento Imobiliário',
    ticker: 'HOSI11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/housi--big.svg'
  },
  {
    id: 12,
    nome: 'RBR Rendimentos High Grade Fundo de Investimento Imobiliário',
    ticker: 'RBRR11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/rbr-rendimentos--big.svg'
  },
  {
    id: 13,
    nome: 'BTG Pactual Corporate Office Fundo de Investimento Imobiliário',
    ticker: 'BRCO11',
    tipo: 'FII',
    categoria: 'Escritórios',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/btg-pactual-corporate--big.svg'
  },
  {
    id: 14,
    nome: 'Fundo de Investimento Imobiliário FII RBR Desenvolvimento',
    ticker: 'RBRD11',
    tipo: 'FII',
    categoria: 'Desenvolvimento',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/rbr-desenvolvimento--big.svg'
  },
  {
    id: 15,
    nome: 'CSHG Recebíveis Imobiliários Fundo de Investimento Imobiliário',
    ticker: 'HGCR11',
    tipo: 'FII',
    categoria: 'Recebíveis',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/cshg-recebiveis--big.svg'
  },
  {
    id: 16,
    nome: 'Kinea Rendimentos Imobiliários II Fundo de Investimento Imobiliário',
    ticker: 'KNCR11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/kinea-rendimentos-ii--big.svg'
  },
  {
    id: 17,
    nome: 'Vinci Partners Recebíveis Imobiliários Fundo de Investimento Imobiliário',
    ticker: 'VCRR11',
    tipo: 'FII',
    categoria: 'Recebíveis',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/vinci-recebiveis--big.svg'
  },
  {
    id: 18,
    nome: 'BTG Pactual Shoppings Fundo de Investimento Imobiliário',
    ticker: 'BPML11',
    tipo: 'FII',
    categoria: 'Shopping',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/btg-pactual-shoppings--big.svg'
  },
  {
    id: 19,
    nome: 'XP Selection Fundo de Investimento Imobiliário',
    ticker: 'XPSF11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/xp-selection--big.svg'
  },
  {
    id: 20,
    nome: 'Hedge Realty Fundo de Investimento Imobiliário',
    ticker: 'HGRU11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/hedge-realty--big.svg'
  },
  {
    id: 21,
    nome: 'RBR Logística Fundo de Investimento Imobiliário',
    ticker: 'RBRL11',
    tipo: 'FII',
    categoria: 'Logística',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/rbr-logistica--big.svg'
  },
  {
    id: 22,
    nome: 'CSHG Imobiliário Fundo de Investimento Imobiliário',
    ticker: 'HGFF11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/cshg-imobiliario--big.svg'
  },
  {
    id: 23,
    nome: 'Kinea Renda Imobiliária Fundo de Investimento Imobiliário',
    ticker: 'KNIP11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/kinea-renda--big.svg'
  },
  {
    id: 24,
    nome: 'Vinci Partners Recebíveis Imobiliários II Fundo de Investimento Imobiliário',
    ticker: 'VCRI11',
    tipo: 'FII',
    categoria: 'Recebíveis',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/vinci-recebiveis-ii--big.svg'
  },
  {
    id: 25,
    nome: 'BTG Pactual Recebíveis Imobiliários Fundo de Investimento Imobiliário',
    ticker: 'BTRX11',
    tipo: 'FII',
    categoria: 'Recebíveis',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/btg-pactual-recebiveis--big.svg'
  },
  {
    id: 26,
    nome: 'XP Selection II Fundo de Investimento Imobiliário',
    ticker: 'XPIN11',
    tipo: 'FII',
    categoria: 'Tijolo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/xp-selection-ii--big.svg'
  },
  {
    id: 27,
    nome: 'Hedge Office Fundo de Investimento Imobiliário',
    ticker: 'HFOF11',
    tipo: 'FII',
    categoria: 'Escritórios',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/hedge-office--big.svg'
  },
  {
    id: 28,
    nome: 'RBR Malls Fundo de Investimento Imobiliário',
    ticker: 'RBRS11',
    tipo: 'FII',
    categoria: 'Shopping',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/rbr-malls--big.svg'
  },
  {
    id: 29,
    nome: 'CSHG Office Fundo de Investimento Imobiliário',
    ticker: 'HGPO11',
    tipo: 'FII',
    categoria: 'Escritórios',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/cshg-office--big.svg'
  },
  {
    id: 30,
    nome: 'Kinea Shopping Centers Fundo de Investimento Imobiliário',
    ticker: 'KNSC11',
    tipo: 'FII',
    categoria: 'Shopping',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/kinea-shopping--big.svg'
  },

  // AÇÕES BRASILEIRAS (20)
  {
    id: 31,
    nome: 'Petróleo Brasileiro S.A. - Petrobras',
    ticker: 'PETR4',
    tipo: 'AÇÃO',
    categoria: 'Energia',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/petrobras--big.svg'
  },
  {
    id: 32,
    nome: 'Vale S.A.',
    ticker: 'VALE3',
    tipo: 'AÇÃO',
    categoria: 'Mineração',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/vale--big.svg'
  },
  {
    id: 33,
    nome: 'Itaú Unibanco Holding S.A.',
    ticker: 'ITUB4',
    tipo: 'AÇÃO',
    categoria: 'Bancos',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/itau--big.svg'
  },
  {
    id: 34,
    nome: 'Banco Bradesco S.A.',
    ticker: 'BBDC4',
    tipo: 'AÇÃO',
    categoria: 'Bancos',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/bradesco--big.svg'
  },
  {
    id: 35,
    nome: 'Ambev S.A.',
    ticker: 'ABEV3',
    tipo: 'AÇÃO',
    categoria: 'Bebidas',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/ambev--big.svg'
  },
  {
    id: 36,
    nome: 'WEG S.A.',
    ticker: 'WEGE3',
    tipo: 'AÇÃO',
    categoria: 'Tecnologia',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/weg--big.svg'
  },
  {
    id: 37,
    nome: 'Magazine Luiza S.A.',
    ticker: 'MGLU3',
    tipo: 'AÇÃO',
    categoria: 'Varejo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/magazine-luiza--big.svg'
  },
  {
    id: 38,
    nome: 'Localiza Rent a Car S.A.',
    ticker: 'RENT3',
    tipo: 'AÇÃO',
    categoria: 'Serviços',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/localiza--big.svg'
  },
  {
    id: 39,
    nome: 'Banco do Brasil S.A.',
    ticker: 'BBAS3',
    tipo: 'AÇÃO',
    categoria: 'Bancos',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/banco-do-brasil--big.svg'
  },
  {
    id: 40,
    nome: 'Banco Santander Brasil S.A.',
    ticker: 'SANB11',
    tipo: 'AÇÃO',
    categoria: 'Bancos',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/santander--big.svg'
  },
  {
    id: 41,
    nome: 'Eletrobras',
    ticker: 'ELET3',
    tipo: 'AÇÃO',
    categoria: 'Energia',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/eletrobras--big.svg'
  },
  {
    id: 42,
    nome: 'JBS S.A.',
    ticker: 'JBSS3',
    tipo: 'AÇÃO',
    categoria: 'Alimentos',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/jbs--big.svg'
  },
  {
    id: 43,
    nome: 'Raia Drogasil S.A.',
    ticker: 'RADL3',
    tipo: 'AÇÃO',
    categoria: 'Varejo',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/raia-drogasil--big.svg'
  },
  {
    id: 44,
    nome: 'Rede D\'Or São Luiz S.A.',
    ticker: 'RDOR3',
    tipo: 'AÇÃO',
    categoria: 'Saúde',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/rede-dor--big.svg'
  },
  {
    id: 45,
    nome: 'Suzano S.A.',
    ticker: 'SUZB3',
    tipo: 'AÇÃO',
    categoria: 'Papel e Celulose',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/suzano--big.svg'
  },
  {
    id: 46,
    nome: 'Klabin S.A.',
    ticker: 'KLBN11',
    tipo: 'AÇÃO',
    categoria: 'Papel e Celulose',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/klabin--big.svg'
  },
  {
    id: 47,
    nome: 'Rumo S.A.',
    ticker: 'RAIL3',
    tipo: 'AÇÃO',
    categoria: 'Logística',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/rumo--big.svg'
  },
  {
    id: 48,
    nome: 'Cielo S.A.',
    ticker: 'CIEL3',
    tipo: 'AÇÃO',
    categoria: 'Tecnologia',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/cielo--big.svg'
  },
  {
    id: 49,
    nome: 'Gerdau S.A.',
    ticker: 'GGBR4',
    tipo: 'AÇÃO',
    categoria: 'Siderurgia',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/gerdau--big.svg'
  },
  {
    id: 50,
    nome: 'Usinas Siderúrgicas de Minas Gerais S.A.',
    ticker: 'USIM5',
    tipo: 'AÇÃO',
    categoria: 'Siderurgia',
    pais: 'BR',
    imagem: 'https://s3-symbol-logo.tradingview.com/usiminas--big.svg'
  },

  // ETFs BRASILEIROS E INTERNACIONAIS (10)
  {
    id: 51,
    nome: 'iShares S&P 500',
    ticker: 'IVVB11',
    tipo: 'ETF',
    categoria: 'Internacional',
    pais: 'BR',
    imagem: 'https://logo.clearbit.com/blackrock.com'
  },
  {
    id: 52,
    nome: 'iShares Ibovespa',
    ticker: 'BOVA11',
    tipo: 'ETF',
    categoria: 'Índice',
    pais: 'BR',
    imagem: 'https://logo.clearbit.com/blackrock.com'
  },
  {
    id: 53,
    nome: 'iShares Small Cap',
    ticker: 'SMAL11',
    tipo: 'ETF',
    categoria: 'Índice',
    pais: 'BR',
    imagem: 'https://logo.clearbit.com/blackrock.com'
  },
  {
    id: 54,
    nome: 'iShares Dividendos',
    ticker: 'DIVO11',
    tipo: 'ETF',
    categoria: 'Dividendos',
    pais: 'BR',
    imagem: 'https://logo.clearbit.com/blackrock.com'
  },
  {
    id: 55,
    nome: 'iShares Índice de Consumo',
    ticker: 'ICON11',
    tipo: 'ETF',
    categoria: 'Setorial',
    pais: 'BR',
    imagem: 'https://logo.clearbit.com/blackrock.com'
  },
  {
    id: 56,
    nome: 'SPDR S&P 500 ETF Trust',
    ticker: 'SPY',
    tipo: 'ETF',
    categoria: 'Internacional',
    pais: 'US',
    imagem: 'https://logo.clearbit.com/spdrs.com'
  },
  {
    id: 57,
    nome: 'Invesco QQQ Trust',
    ticker: 'QQQ',
    tipo: 'ETF',
    categoria: 'Tecnologia',
    pais: 'US',
    imagem: 'https://logo.clearbit.com/invesco.com'
  },
  {
    id: 58,
    nome: 'Vanguard Total Stock Market ETF',
    ticker: 'VTI',
    tipo: 'ETF',
    categoria: 'Internacional',
    pais: 'US',
    imagem: 'https://logo.clearbit.com/vanguard.com'
  },
  {
    id: 59,
    nome: 'Vanguard S&P 500 ETF',
    ticker: 'VOO',
    tipo: 'ETF',
    categoria: 'Internacional',
    pais: 'US',
    imagem: 'https://logo.clearbit.com/vanguard.com'
  },
  {
    id: 60,
    nome: 'iShares Core MSCI EAFE ETF',
    ticker: 'IEFA',
    tipo: 'ETF',
    categoria: 'Internacional',
    pais: 'US',
    imagem: 'https://logo.clearbit.com/blackrock.com'
  },

  // CRIPTOMOEDAS (10)
  {
    id: 61,
    nome: 'Bitcoin',
    ticker: 'BTC',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/btc@2x.png'
  },
  {
    id: 62,
    nome: 'Ethereum',
    ticker: 'ETH',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/eth@2x.png'
  },
  {
    id: 63,
    nome: 'Solana',
    ticker: 'SOL',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/sol@2x.png'
  },
  {
    id: 64,
    nome: 'Binance Coin',
    ticker: 'BNB',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/bnb@2x.png'
  },
  {
    id: 65,
    nome: 'Cardano',
    ticker: 'ADA',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/ada@2x.png'
  },
  {
    id: 66,
    nome: 'XRP',
    ticker: 'XRP',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/xrp@2x.png'
  },
  {
    id: 67,
    nome: 'Polkadot',
    ticker: 'DOT',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/dot@2x.png'
  },
  {
    id: 68,
    nome: 'Polygon',
    ticker: 'MATIC',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/matic@2x.png'
  },
  {
    id: 69,
    nome: 'Avalanche',
    ticker: 'AVAX',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/avax@2x.png'
  },
  {
    id: 70,
    nome: 'Chainlink',
    ticker: 'LINK',
    tipo: 'CRIPTO',
    categoria: 'Moeda Digital',
    pais: 'US',
    imagem: 'https://assets.coincap.io/assets/icons/link@2x.png'
  }
];

module.exports = investments;

