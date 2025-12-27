const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
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

const profitSchema = new mongoose.Schema({
  value: {
    type: Number,
    required: true,
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

const piggyBankSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Nome do cofrinho é obrigatório'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  currentAmount: {
    type: Number,
    required: [true, 'Valor investido é obrigatório'],
    default: 0,
    min: 0,
  },
  totalProfit: {
    type: Number,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    default: 'BRL',
    uppercase: true,
  },
  status: {
    type: String,
    enum: ['ativo', 'encerrado'],
    default: 'ativo',
  },
  contributions: [contributionSchema],
  profits: [profitSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model('PiggyBank', piggyBankSchema);

