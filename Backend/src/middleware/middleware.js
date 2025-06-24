const adminAuth = (req, res, next) => {
  if (req.query.prev == "admin") next();
  else res.status(401).send("❌you are not admin❌");
};

module.exports = { adminAuth };