const jwt = require("jsonwebtoken");
const secretKey = process.env.ADMIN_JWT_SECRET;

const authenticateAdmin = (req, res, next) => {
    console.log(req.cookies);

  const { admin_refreshToken, admin_accessToken } = req.cookies;
  
  

  if (!admin_accessToken && !admin_refreshToken) {
    console.log("Access denied");
    return res.status(401).json({ message: "Access denied. No token provided." });
  } 

  try {
    const decoded = jwt.verify(admin_accessToken, secretKey);
    req.admin = decoded.userId;
    return next();
  } catch (error) {
   
    if (!admin_refreshToken) {
      return res.status(401).send("Access Denied. Invalid or expired access token and no refresh token provided.");
    }

    try {
      const decodedRefresh = jwt.verify(admin_refreshToken, secretKey);
      const newAccessToken = jwt.sign({ userId: decodedRefresh.userId }, secretKey, { expiresIn: "15m" });

      res.cookie("admin_accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: "strict",
      });
      req.admin = decodedRefresh.userId; // Attach decoded admin ID to request object
      return next();
    } catch (refreshError) {
      return res.status(400).send("Invalid refresh token.");
    }
  }
};

module.exports = { authenticateAdmin };
