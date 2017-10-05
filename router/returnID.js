const jwt = require('jsonwebtoken');

module.exports = (req) => {
  const token = req.get('Authorization');
  return jwt.verify(token, process.env.token, function (err, decoded) {
      if (decoded === undefined) {
        return null;
      }

      return decoded.id;
    });
};
