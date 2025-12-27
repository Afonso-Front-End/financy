const jwt = require('jsonwebtoken');
const User = require('../models/User');
const jwtConfig = require('../config/jwt');

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token não fornecido. Acesso negado.',
      });
    }

    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      req.user = await User.findById(decoded.id).select('-password');
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não encontrado.',
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido ou expirado.',
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erro no servidor.',
    });
  }
};

module.exports = authMiddleware;

