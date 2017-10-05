const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.get('Authorization');
  jwt.verify(token, process.env.token, function (err, decoded) {
      if (decoded === undefined) {
        res.status(401).json({ msg: 'You are not authorized.' });
        return;
      }

      return next();
    });
};
