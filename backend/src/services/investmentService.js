const Investment = require('../models/Investment');

class InvestmentService {
  // Calcular rendimento mensal
  static calculateMonthlyProfit(investedAmount, monthlyRate) {
    return (investedAmount * monthlyRate) / 100;
  }

  // Validar se o saque é permitido
  static validateWithdrawal(investment, withdrawalAmount) {
    if (withdrawalAmount <= 0) {
      throw new Error('Valor do saque deve ser maior que zero');
    }

    if (withdrawalAmount > investment.totalProfit) {
      throw new Error('Valor do saque não pode ser maior que o lucro disponível');
    }

    if (investment.investedAmount < 0) {
      throw new Error('Saldo não pode ser negativo');
    }
  }

  // Adicionar aporte
  static async addContribution(investmentId, value, description = '', quantity = 0) {
    const investment = await Investment.findById(investmentId);
    
    if (!investment) {
      throw new Error('Investimento não encontrado');
    }

    investment.investedAmount += value;
    if (quantity > 0) {
      investment.quantity += quantity;
    }
    investment.history.push({
      type: 'APORTE',
      value,
      quantity: quantity || 0,
      date: new Date(),
      description,
    });

    await investment.save();
    return investment;
  }

  // Adicionar rendimento
  static async addProfit(investmentId, value, description = '') {
    const investment = await Investment.findById(investmentId);
    
    if (!investment) {
      throw new Error('Investimento não encontrado');
    }

    if (!value || value <= 0) {
      throw new Error('Valor do rendimento deve ser maior que zero');
    }

    investment.totalProfit += value;
    investment.history.push({
      type: 'RENDIMENTO',
      value,
      date: new Date(),
      description,
    });

    await investment.save();
    return investment;
  }

  // Realizar saque
  static async makeWithdrawal(investmentId, value, description = '', quantity = 0) {
    const investment = await Investment.findById(investmentId);
    
    if (!investment) {
      throw new Error('Investimento não encontrado');
    }

    // Se informou quantidade, valida se tem cotas suficientes
    if (quantity > 0) {
      if (quantity > investment.quantity) {
        throw new Error('Quantidade de cotas insuficiente');
      }
      investment.quantity -= quantity;
    }

    this.validateWithdrawal(investment, value);

    investment.totalProfit -= value;
    investment.history.push({
      type: 'SAQUE',
      value,
      quantity: quantity || 0,
      date: new Date(),
      description,
    });

    await investment.save();
    return investment;
  }

  // Reinvestir lucro
  static async reinvestProfit(investmentId, value = null) {
    const investment = await Investment.findById(investmentId);
    
    if (!investment) {
      throw new Error('Investimento não encontrado');
    }

    const reinvestAmount = value || investment.totalProfit;
    
    if (reinvestAmount > investment.totalProfit) {
      throw new Error('Valor de reinvestimento não pode ser maior que o lucro disponível');
    }

    investment.investedAmount += reinvestAmount;
    investment.totalProfit -= reinvestAmount;
    investment.history.push({
      type: 'APORTE',
      value: reinvestAmount,
      date: new Date(),
      description: 'Reinvestimento de lucro',
    });

    await investment.save();
    return investment;
  }

  // Obter estatísticas do usuário
  static async getUserStatistics(userId) {
    const PiggyBank = require('../models/PiggyBank');
    
    const investments = await Investment.find({ userId, status: 'ativo' });
    const piggyBanks = await PiggyBank.find({ userId, status: 'ativo' });

    // Total investido = investimentos + cofrinhos
    const totalInvestedFromInvestments = investments.reduce(
      (sum, inv) => sum + inv.investedAmount,
      0
    );
    
    const totalInvestedFromPiggyBanks = piggyBanks.reduce(
      (sum, pb) => sum + pb.currentAmount,
      0
    );
    
    const totalInvested = totalInvestedFromInvestments + totalInvestedFromPiggyBanks;

    const totalProfitFromInvestments = investments.reduce(
      (sum, inv) => sum + inv.totalProfit,
      0
    );
    
    const totalProfitFromPiggyBanks = piggyBanks.reduce(
      (sum, pb) => sum + (pb.totalProfit || 0),
      0
    );
    
    const totalProfit = totalProfitFromInvestments + totalProfitFromPiggyBanks;

    // Lucro do mês atual
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const currentMonthProfit = investments.reduce((sum, inv) => {
      const monthProfits = inv.history
        .filter(h => h.type === 'RENDIMENTO' && h.date >= currentMonth)
        .reduce((s, h) => s + h.value, 0);
      return sum + monthProfits;
    }, 0);

    // Evolução mensal (últimos 12 meses)
    const monthlyEvolution = [];
    for (let i = 11; i >= 0; i--) {
      const month = new Date();
      month.setMonth(month.getMonth() - i);
      month.setDate(1);
      month.setHours(0, 0, 0, 0);

      const nextMonth = new Date(month);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      const monthProfit = investments.reduce((sum, inv) => {
        const profits = inv.history
          .filter(
            h =>
              h.type === 'RENDIMENTO' &&
              h.date >= month &&
              h.date < nextMonth
          )
          .reduce((s, h) => s + h.value, 0);
        return sum + profits;
      }, 0);

      monthlyEvolution.push({
        month: month.toISOString().substring(0, 7),
        profit: monthProfit,
      });
    }

    return {
      totalInvested,
      totalProfit,
      currentMonthProfit,
      monthlyEvolution,
      investmentsCount: investments.length,
      piggyBanksCount: piggyBanks.length,
      totalInPiggyBanks: totalInvestedFromPiggyBanks,
    };
  }
}

module.exports = InvestmentService;

