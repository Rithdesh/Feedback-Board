const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
    try {
      const token = req.header("Authorization")?.split(" ")[1];
      
      if (!token) {
        return res.status(401).json({ message: "Token required" });
      }
      
      const decoded = jwt.verify(token, process.env.SECRET);
      req.user = decoded; 
      next();
    } catch (error) {
      console.error("JWT error:", error.message);
      res.status(401).json({ message: "Invalid or expired token", error: error.message });
    }
  };

  const authenticateJWTOptional = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
  
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
      } catch (err) {
        req.user = null;
        req.name = "Anonymous"; 
      }
    } else {
      req.user = null; 
      req.name = "Anonymous"; 
    }
    next();
  };

  module.exports = {authenticateJWT,authenticateJWTOptional};