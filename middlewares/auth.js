const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config');

const handleError = (res) => {
  res.status(401).send({ message: 'С токеном что-то не так.' });
};

// eslint-disable-next-line consistent-return
module.exports = function authMiddleware(req, res, next) {
  const { authorization } = req.headers;
  let payload;

  if (!authorization || !authorization.startsWith('Bearer ')) return handleError(res);

  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return handleError(res);

    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return handleError(res);
  }

  req.user = payload;

  next();
};
