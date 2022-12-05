const jwt = require("jsonwebtoken");

module.exports.authenticateUser = (req, res, next) => {
  //check the token in headers
  if (!req.headers["access-token"]) {
    return res.status(400).send({
      msg: "Token not found",
    });
  }

  //validate token
  try {
    const user = jwt.verify(req.headers["access-token"], process.env.SECRET_KEY);
    next();
  } catch (error) {
    return res.status(400).send({
        msg: "Invalid Token",
      });
  }
};
