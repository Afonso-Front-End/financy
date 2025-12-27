const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['APORTE', 'RENDIMENTO', 'SAQUE'],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    default: '',
  },
});

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Nome do investimento é obrigatório'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Tipo do investimento é obrigatório'],
    trim: true,
  },
  investedAmount: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  monthlyRate: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
    min: 0,
  },
  dailyLiquidity: {
    type: Boolean,
    default: false,
  },
  dailyProfit: {
    type: Number,
    default: 0,
    min: 0,
  },
  hasDailyProfit: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['ativo', 'encerrado'],
    default: 'ativo',
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  currency: {
    type: String,
    default: 'BRL',
    uppercase: true,
  },
  quantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  history: [historySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Investment', investmentSchema);

