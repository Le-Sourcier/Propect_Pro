const jwt = require("jsonwebtoken");
const db = require("../models");

const rateLimit = require("express-rate-limit");
const { serverMessage } = require("../utils");

const unprotectedRoutes = [
  "/api/user/login",
  "/api/user/register",
  "/api/user/refresh",
];
const authorize = async (req, res, next) => {
  // if (unprotectedRoutes.includes(req.originalUrl)) {
  //   return next(); // Pas besoin de JWT ici
  // }

  const path = req.originalUrl.split("?")[0];
  if (unprotectedRoutes.includes(path)) {
    return next();
  }
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return serverMessage(res, "FORBIDDEN_RESOURCE");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await db.Users.findByPk(decoded.id, {
      include: [{ model: db.Profiles, as: "profile" }],
    });
    // const user = await db.Users.findByPk(decoded.id);
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

// Middleware pour limiter les tentatives de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limite chaque IP à 5 requêtes par windowMs
  message: serverMessage(null, "TOO_MANY_ATTEMPTS"),
  standardHeaders: true, // renvoie les headers rate limit standard
  legacyHeaders: false, // désactive les X-RateLimit-* headers
});

module.exports = { authorize, loginLimiter };
