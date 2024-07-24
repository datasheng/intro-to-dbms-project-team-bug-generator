const jwt = require("jsonwebtoken");

async function verifyToken(req, res, next) {
  const token = req.cookies.auth;

  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Forbidden - No auth token provided",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(500).send("Failed to authenticate token");
    }

    req.userId = decoded.id;
    req.userFullName = decoded.name;
    next();
  });
}

module.exports = verifyToken;
