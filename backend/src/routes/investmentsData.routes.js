const express = require('express');
const router = express.Router();
const investments = require('../data/investments');

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    count: investments.length,
    data: investments
  });
});

router.get('/:ticker', (req, res) => {
  const ticker = req.params.ticker.toUpperCase();
  const investment = investments.find(
    inv => inv.ticker.toUpperCase() === ticker
  );

  if (!investment) {
    return res.status(404).json({
      success: false,
      message: 'Investimento não encontrado'
    });
  }

  res.status(200).json({
    success: true,
    data: investment
  });
});

router.get('/tipo/:tipo', (req, res) => {
  const tipo = req.params.tipo.toUpperCase();
  const filtered = investments.filter(
    inv => inv.tipo.toUpperCase() === tipo
  );

  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

router.get('/pais/:pais', (req, res) => {
  const pais = req.params.pais.toUpperCase();
  const filtered = investments.filter(
    inv => inv.pais.toUpperCase() === pais
  );

  res.status(200).json({
    success: true,
    count: filtered.length,
    data: filtered
  });
});

module.exports = router;

