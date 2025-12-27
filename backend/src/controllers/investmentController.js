const Investment = require('../models/Investment');
const InvestmentService = require('../services/investmentService');

// @desc    Criar novo investimento
// @route   POST /api/investments
// @access  Private
exports.createInvestment = async (req, res) => {
  try {
    const {
      name,
      type,
      investedAmount,
      monthlyRate,
      dailyLiquidity,
      dailyProfit,
      hasDailyProfit,
      startDate,
    } = req.body;

    if (!name || investedAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Nome e valor investido são obrigatórios',
      });
    }

    const investment = await Investment.create({
      userId: req.user.id,
      name,
      type: type || 'Outros',
      investedAmount,
      monthlyRate: monthlyRate || 0,
      dailyLiquidity: dailyLiquidity || false,
      dailyProfit: dailyProfit || 0,
      hasDailyProfit: hasDailyProfit || false,
      currency: currency || 'BRL',
      quantity: quantity || 0,
      startDate: startDate || new Date(),
      history: [
        {
          type: 'APORTE',
          value: investedAmount,
          quantity: quantity || 0,
          date: startDate || new Date(),
          description: 'Aporte inicial',
        },
      ],
    });

    res.status(201).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao criar investimento',
      error: error.message,
    });
  }
};

// @desc    Obter todos os investimentos do usuário (incluindo cofrinhos)
// @route   GET /api/investments
// @access  Private
exports.getInvestments = async (req, res) => {
  try {
    const PiggyBank = require('../models/PiggyBank');
    
    const investments = await Investment.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    
    // Buscar cofrinhos e transformar em formato de investimento
    const piggyBanks = await PiggyBank.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    
    // Transformar cofrinhos em formato de investimento para exibição
    const piggyBanksAsInvestments = piggyBanks.map(pb => {
      const history = [
        ...pb.contributions.map(contrib => ({
          type: 'APORTE',
          value: contrib.value,
          date: contrib.date,
          description: contrib.description || 'Contribuição ao cofrinho',
        })),
        ...(pb.profits || []).map(profit => ({
          type: 'RENDIMENTO',
          value: profit.value,
          date: profit.date,
          description: profit.description || 'Rendimento do cofrinho',
        })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      return {
        _id: pb._id,
        userId: pb.userId,
        name: pb.name,
        type: 'Cofrinho',
        investedAmount: pb.currentAmount,
        monthlyRate: 0,
        totalProfit: pb.totalProfit || 0,
        dailyLiquidity: true,
        dailyProfit: 0,
        hasDailyProfit: false,
        status: pb.status === 'encerrado' ? 'encerrado' : 'ativo',
        startDate: pb.createdAt,
        currency: pb.currency,
        history: history,
        createdAt: pb.createdAt,
        isPiggyBank: true, // Flag para identificar que é um cofrinho
        piggyBankData: {
          currentAmount: pb.currentAmount,
          description: pb.description,
        },
      };
    });
    
    // Combinar investimentos e cofrinhos
    const allInvestments = [...investments, ...piggyBanksAsInvestments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      count: allInvestments.length,
      data: allInvestments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter investimentos',
      error: error.message,
    });
  }
};

// @desc    Obter investimento específico
// @route   GET /api/investments/:id
// @access  Private
exports.getInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investimento não encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter investimento',
      error: error.message,
    });
  }
};

// @desc    Atualizar investimento
// @route   PUT /api/investments/:id
// @access  Private
exports.updateInvestment = async (req, res) => {
  try {
    let investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investimento não encontrado',
      });
    }

    investment = await Investment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar investimento',
      error: error.message,
    });
  }
};

// @desc    Deletar investimento
// @route   DELETE /api/investments/:id
// @access  Private
exports.deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'Investimento não encontrado',
      });
    }

    await investment.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Investimento removido com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar investimento',
      error: error.message,
    });
  }
};

// @desc    Adicionar aporte
// @route   POST /api/investments/:id/contribution
// @access  Private
exports.addContribution = async (req, res) => {
  try {
    const { value, description, quantity } = req.body;

    if (!value || value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor do aporte deve ser maior que zero',
      });
    }

    const investment = await InvestmentService.addContribution(
      req.params.id,
      value,
      description,
      quantity || 0
    );

    // Verificar se o investimento pertence ao usuário
    if (investment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Erro ao adicionar aporte',
    });
  }
};

// @desc    Adicionar rendimento
// @route   POST /api/investments/:id/profit
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

    const investment = await InvestmentService.addProfit(
      req.params.id,
      value,
      description
    );

    // Verificar se o investimento pertence ao usuário
    if (investment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao adicionar rendimento',
    });
  }
};

// @desc    Realizar saque
// @route   POST /api/investments/:id/withdrawal
// @access  Private
exports.makeWithdrawal = async (req, res) => {
  try {
    const { value, description, quantity } = req.body;

    if (!value || value <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valor do saque deve ser maior que zero',
      });
    }

    const investment = await InvestmentService.makeWithdrawal(
      req.params.id,
      value,
      description,
      quantity || 0
    );

    // Verificar se o investimento pertence ao usuário
    if (investment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao realizar saque',
    });
  }
};

// @desc    Reinvestir lucro
// @route   POST /api/investments/:id/reinvest
// @access  Private
exports.reinvestProfit = async (req, res) => {
  try {
    const { value } = req.body;

    const investment = await InvestmentService.reinvestProfit(
      req.params.id,
      value
    );

    // Verificar se o investimento pertence ao usuário
    if (investment.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado',
      });
    }

    res.status(200).json({
      success: true,
      data: investment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao reinvestir lucro',
    });
  }
};

// @desc    Obter estatísticas do usuário
// @route   GET /api/investments/stats/summary
// @access  Private
exports.getStatistics = async (req, res) => {
  try {
    const stats = await InvestmentService.getUserStatistics(req.user.id);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas',
      error: error.message,
    });
  }
};

