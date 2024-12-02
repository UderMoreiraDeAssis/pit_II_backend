const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select('-password');

    if (!req.user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    next();
  } catch (err) {
    console.error('Erro no middleware de autenticação:', err.message);
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

module.exports = authMiddleware;
