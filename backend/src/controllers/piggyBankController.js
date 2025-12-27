const PiggyBank = require('../models/PiggyBank');

// @desc    Criar novo cofrinho
// @route   POST /api/piggybanks
// @access  Private
exports.createPiggyBank = async (req, res) => {
  try {
    const { name, description, currentAmount, currency } = req.body;

    if (!name || currentAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Nome e valor investido são obrigatórios',
      });
    }

    const piggyBank = await PiggyBank.create({
      userId: req.user.id,
      name,
      description: description || '',
      currentAmount: parseFloat(currentAmount) || 0,
      currency: currency || 'BRL',
      status: 'ativo',
      contributions: currentAmount > 0 ? [{
        value: parseFloat(currentAmount),
        date: new Date(),
        description: 'Valor inicial',
      }] : [],
    });

    res.status(201).json({
      success: true,
      data: piggyBank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar cofrinho',
      error: error.message,
    });
  }
};

// @desc    Obter todos os cofrinhos do usuário
// @route   GET /api/piggybanks
// @access  Private
exports.getPiggyBanks = async (req, res) => {
  try {
    const piggyBanks = await PiggyBank.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: piggyBanks.length,
      data: piggyBanks,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter cofrinhos',
      error: error.message,
    });
  }
};

// @desc    Obter cofrinho específico
// @route   GET /api/piggybanks/:id
// @access  Private
exports.getPiggyBank = async (req, res) => {
  try {
    const piggyBank = await PiggyBank.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!piggyBank) {
      return res.status(404).json({
        success: false,
        message: 'Cofrinho não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: piggyBank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter cofrinho',
      error: error.message,
    });
  }
};

// @desc    Atualizar cofrinho
// @route   PUT /api/piggybanks/:id
// @access  Private
exports.updatePiggyBank = async (req, res) => {
  try {
    let piggyBank = await PiggyBank.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!piggyBank) {
      return res.status(404).json({
        success: false,
        message: 'Cofrinho não encontrado',
      });
    }

    piggyBank = await PiggyBank.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: piggyBank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cofrinho',
      error: error.message,
    });
  }
};

// @desc    Deletar cofrinho
// @route   DELETE /api/piggybanks/:id
// @access  Private
exports.deletePiggyBank = async (req, res) => {
  try {
    const piggyBank = await PiggyBank.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!piggyBank) {
      return res.status(404).json({
        success: false,
        message: 'Cofrinho não encontrado',
      });
    }

    await piggyBank.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Cofrinho removido com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar cofrinho',
      error: error.message,
    });
  }
};

// @desc    Adicionar contribuição ao cofrinho
// @route   POST /api/piggybanks/:id/contribute
// @access  Private
exports.addContribution = async (req, res) => {
  try {
    const { value, description } = req.body;

    if (!value || value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor da contribuição deve ser maior que zero',
      });
    }

    const piggyBank = await PiggyBank.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!piggyBank) {
      return res.status(404).json({
        success: false,
        message: 'Cofrinho não encontrado',
      });
    }

    if (piggyBank.status !== 'ativo') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível adicionar contribuições a um cofrinho inativo',
      });
    }

    piggyBank.currentAmount += parseFloat(value);
    piggyBank.contributions.push({
      value: parseFloat(value),
      date: new Date(),
      description: description || '',
    });

    await piggyBank.save();

    res.status(200).json({
      success: true,
      data: piggyBank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar contribuição',
      error: error.message,
    });
  }
};

// @desc    Retirar valor do cofrinho
// @route   POST /api/piggybanks/:id/withdraw
// @access  Private
exports.withdrawFromPiggyBank = async (req, res) => {
  try {
    const { value, description } = req.body;

    if (!value || value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor do saque deve ser maior que zero',
      });
    }

    const piggyBank = await PiggyBank.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!piggyBank) {
      return res.status(404).json({
        success: false,
        message: 'Cofrinho não encontrado',
      });
    }

    if (piggyBank.currentAmount < parseFloat(value)) {
      return res.status(400).json({
        success: false,
        message: 'Valor insuficiente no cofrinho',
      });
    }

    piggyBank.currentAmount -= parseFloat(value);

    await piggyBank.save();

    res.status(200).json({
      success: true,
      data: piggyBank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao retirar valor',
      error: error.message,
    });
  }
};

// @desc    Adicionar rendimento ao cofrinho
// @route   POST /api/piggybanks/:id/profit
// @access  Private
exports.addProfit = async (req, res) => {
  try {
    const { value, description } = req.body;

    if (!value || value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor do rendimento deve ser maior que zero',
      });
    }

    const piggyBank = await PiggyBank.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!piggyBank) {
      return res.status(404).json({
        success: false,
        message: 'Cofrinho não encontrado',
      });
    }

    if (piggyBank.status !== 'ativo') {
      return res.status(400).json({
        success: false,
        message: 'Não é possível adicionar rendimento a um cofrinho inativo',
      });
    }

    piggyBank.totalProfit += parseFloat(value);
    piggyBank.profits.push({
      value: parseFloat(value),
      date: new Date(),
      description: description || '',
    });

    await piggyBank.save();

    res.status(200).json({
      success: true,
      data: piggyBank,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao adicionar rendimento',
      error: error.message,
    });
  }
};

