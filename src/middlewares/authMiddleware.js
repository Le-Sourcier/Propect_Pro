const jwt = require("jsonwebtoken");
const db = require("../models");
const { serverMessage } = require("../utils");

const authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return serverMessage(res, "FORBIDDEN_RESOURCE");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.Users.findByPk(decoded.id);
    if (!user) {
      return serverMessage(res, "ACCOUNT_NOT_FOUND");
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return serverMessage(res, "TOKEN_EXPIRED");
    }

    if (err.name === "JsonWebTokenError") {
      return serverMessage(res, "TOKEN_INVALID");
    }

    return serverMessage(res);
  }
};

module.exports = { authorize };
