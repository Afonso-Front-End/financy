# Integração Frontend-Backend

## Estrutura de Serviços

### 1. `api.js` - Cliente HTTP Base
- Configuração do Axios
- Interceptors para autenticação (JWT)
- Tratamento de erros 401 (logout automático)
- Base URL: `http://localhost:5000/api`

### 2. `investmentsApi.js` - Serviço de Investimentos Disponíveis
**Novo serviço que busca do backend:**
- `getAvailableInvestments()` - Lista todos os investimentos disponíveis
- `getInvestmentByTicker(ticker)` - Busca por ticker
- `getInvestmentsByType(tipo)` - Filtra por tipo (FII, AÇÃO, ETF, CRIPTO)
- `getInvestmentsByCountry(pais)` - Filtra por país (BR, US)
- `searchInvestmentSuggestions(search)` - Busca sugestões (combina backend + API externa)
- `searchInvestmentTypes(search)` - Busca tipos disponíveis

**Endpoints utilizados:**
- `GET /api/investimentos` - Lista todos
- `GET /api/investimentos/:ticker` - Busca por ticker
- `GET /api/investimentos/tipo/:tipo` - Filtra por tipo
- `GET /api/investimentos/pais/:pais` - Filtra por país

### 3. `financialApi.js` - Serviço de Dados Financeiros Externos
**Integração com APIs externas (brapi):**
- `getCDIRate()` - Taxa CDI atual
- `getSelicRate()` - Taxa Selic atual
- `getStockQuote(symbol)` - Cotação de ações
- `getCryptoQuote(coin)` - Cotação de criptomoedas
- `searchStocks(search)` - Busca ações na B3
- `suggestRateByType(type)` - Sugere taxa baseada no tipo
- `detectInvestmentType(name)` - Detecta tipo pelo nome

**Compatibilidade:**
- `searchInvestmentSuggestions()` - Redireciona para `investmentsApi`
- `searchInvestmentTypes()` - Redireciona para `investmentsApi`

## Páginas e Endpoints

### Dashboard (`/dashboard`)
**Endpoint:** `GET /api/investments/stats/summary`
- Estatísticas gerais do usuário
- Total investido, lucro total, lucro do mês
- Evolução mensal (últimos 12 meses)

### Investments (`/investments`)
**Endpoints utilizados:**
- `GET /api/investments` - Lista investimentos do usuário
- `POST /api/investments` - Criar novo investimento
- `PUT /api/investments/:id` - Atualizar investimento
- `DELETE /api/investments/:id` - Deletar investimento
- `POST /api/investments/:id/contribution` - Adicionar aporte
- `POST /api/investments/:id/profit` - Adicionar rendimento
- `POST /api/investments/:id/withdrawal` - Realizar saque
- `POST /api/investments/:id/reinvest` - Reinvestir lucro

**Integração com investimentos disponíveis:**
- Autocomplete usa `searchInvestmentSuggestions()` do `investmentsApi`
- Busca primeiro no backend, depois na API externa (brapi)
- Detecção automática de tipo e taxa sugerida

### Reports (`/reports`)
**Endpoint:** `GET /api/investments`
- Lista todos os investimentos do usuário
- Filtra histórico de operações
- Gera gráficos e estatísticas

### Profile (`/profile`)
**Endpoints utilizados:**
- `GET /api/auth/me` - Dados do usuário
- `PUT /api/auth/me` - Atualizar perfil
- `PUT /api/auth/change-password` - Alterar senha

## Fluxo de Dados

### Criação de Investimento
1. Usuário digita no campo "Nome do Investimento"
2. `searchInvestmentSuggestions()` busca no backend (`/api/investimentos`)
3. Se não encontrar, busca na API externa (brapi)
4. Ao selecionar, `detectInvestmentType()` identifica o tipo
5. `suggestRateByType()` busca taxa sugerida (CDI/Selic)
6. Formulário é preenchido automaticamente
7. Dados são enviados para `POST /api/investments`

### Operações em Investimentos
- Todas as operações (aporte, rendimento, saque, reinvestimento) usam endpoints específicos
- Dados são atualizados em tempo real após cada operação
- Histórico é mantido no backend

## Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:5000/api
```

## Notas Importantes

1. **Autenticação:** Todas as requisições (exceto login/register) requerem token JWT
2. **Fallback:** Se o backend de investimentos não estiver disponível, usa lista estática
3. **Cache:** Investimentos disponíveis podem ser cacheados no frontend
4. **Erros:** Interceptor trata erros 401 automaticamente (logout)

