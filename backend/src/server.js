const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Carregar variáveis de ambiente
dotenv.config();

// Conectar ao banco de dados
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/investments', require('./routes/investment.routes'));
app.use('/api/investimentos', require('./routes/investmentsData.routes'));
app.use('/api/piggybanks', require('./routes/piggyBank.routes')); // Rotas para cofrinhos

// Rota de teste
app.get('/', (req, res) => {
  res.json({
    message: 'API de Controle de Investimentos funcionando!',
    version: '1.0.0',
  });
});

// Middleware de erro
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});

