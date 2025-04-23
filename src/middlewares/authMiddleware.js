// Authorization middleware
const authorize = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token === "Bearer valid_token") {
    return next();
  }

  return res
    .status(403)
    .json({ status: 403, message: "Forbidden: not authorized" });
};

module.exports = { authorize };
