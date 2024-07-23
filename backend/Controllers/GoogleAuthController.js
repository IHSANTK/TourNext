
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const jwtSecret = process.env.USER_JWT_SECRET;

const generateAccessToken = (user) => { 
  return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '7d' });
};

exports.verifyIdToken =  async (req, res) => {
  const { tokenId } = req.body;
console.log('token',tokenId);
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ googleId: payload.sub });
    if (!user) {
      user = new User({
        
        googleId: payload.sub,
        email: payload.email, 
        name: payload.name,

      });
      await user.save(); 
    }

    const userAccessToken = generateAccessToken(user); 
    const userRefreshToken = generateRefreshToken(user);

    res.cookie('user_refreshToken', userRefreshToken, { httpOnly: true, sameSite: 'Strict', maxAge: 7 * 24 * 60 * 60 * 1000 })
       .cookie('user_accessToken', userAccessToken, { httpOnly: true, sameSite: 'Strict', maxAge: 15 * 60 * 1000 })
       .json({ userAccessToken, user });
  } catch (error) {
    console.error('Error verifying Google token', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};


