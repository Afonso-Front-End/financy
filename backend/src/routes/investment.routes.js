const express = require('express');
const router = express.Router();
const {
  createInvestment,
  getInvestments,
  getInvestment,
  updateInvestment,
  deleteInvestment,
  addContribution,
  addProfit,
  makeWithdrawal,
  reinvestProfit,
  getStatistics,
} = require('../controllers/investmentController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router.route('/')
  .get(getInvestments)
  .post(createInvestment);

router.route('/stats/summary')
  .get(getStatistics);

router.route('/:id')
  .get(getInvestment)
  .put(updateInvestment)
  .delete(deleteInvestment);

router.post('/:id/contribution', addContribution);
router.post('/:id/profit', addProfit);
router.post('/:id/withdrawal', makeWithdrawal);
router.post('/:id/reinvest', reinvestProfit);

module.exports = router;

