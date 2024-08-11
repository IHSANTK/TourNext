const jwt = require("jsonwebtoken");
const secretKey = process.env.USER_JWT_SECRET;

const authenticate = (req, res, next) => {
  // console.log('ckoois',req.cookies);
  const { user_refreshToken, user_accessToken } = req.cookies;

  // console.log('user midlleware',user_refreshToken, user_accessToken);
 

  if (!user_accessToken && !user_refreshToken) {

    console.log('ghfghfgjkfjglkfjglkfjglfjg');
    return res.json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(user_accessToken, secretKey);
    req.user = decoded.userId; 
    return next();
  } catch (error) {
    if (!user_refreshToken) {
      return res.status(401).send("Access Denied. Invalid or expired access token and no refresh token provided.");
    }

    try {
      const decodedRefresh = jwt.verify(user_refreshToken, secretKey);
      const newAccessToken = jwt.sign({ userId: decodedRefresh.userId }, secretKey, { expiresIn: "15m" });

      res.cookie("user_accessToken", newAccessToken, {
        httpOnly: true,
        sameSite: 'None',
        secure: true
      });
      req.user = decodedRefresh.userId; // Attach decoded user ID to request object
      return next();
    } catch (refreshError) {
      return res.status(400).send("Invalid refresh token.");
    }
  }
};

module.exports = { authenticate };
