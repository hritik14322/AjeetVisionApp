const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'ajeet_vision_jwt_secret_key_2026';
  const token = jwt.sign({ userId }, secret, {
    expiresIn: '30d',
  });

  if (res && typeof res.cookie === 'function') {
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  return token;
};

module.exports = generateToken;
