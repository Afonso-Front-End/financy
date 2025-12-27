const express = require('express');
const router = express.Router();
const {
  createPiggyBank,
  getPiggyBanks,
  getPiggyBank,
  updatePiggyBank,
  deletePiggyBank,
  addContribution,
  withdrawFromPiggyBank,
  addProfit,
} = require('../controllers/piggyBankController');
const authMiddleware = require('../middlewares/authMiddleware');

// Todas as rotas requerem autenticação
router.use(authMiddleware);

router
  .route('/')
  .get(getPiggyBanks)
  .post(createPiggyBank);

router
  .route('/:id')
  .get(getPiggyBank)
  .put(updatePiggyBank)
  .delete(deletePiggyBank);

router.post('/:id/contribute', addContribution);
router.post('/:id/withdraw', withdrawFromPiggyBank);
router.post('/:id/profit', addProfit);

module.exports = router;

