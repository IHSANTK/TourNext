const User = require("../models/User");
const otpService = require("../services/otpService");
const jwt = require("jsonwebtoken");

const jwtSecret = process.env.USER_JWT_SECRET;

const generateAccessToken = (user) => {
  return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "15m" });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: "7d" });
};

const sendOtp = async (req, res) => {
  const { email } = req.body;
  console.log("email:", email);
  try {
    const existingUser = await User.findOne({ email });

    console.log("user",existingUser);
    if (!existingUser) {
      return res.status(400).json({ message: "User not exists " });
    }

    const otp = otpService.generateOTP();
    otpService.otpMap.set(email, otp.toString());
    await otpService.sendOTP(email, otp);

    res.sendStatus(200);
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  console.log("ok", email, otp);

  try {
    const existingUser = await User.findOne({ email });

    console.log(existingUser);

    if (!existingUser) {
      return res.status(400).json({ message: "User not exists " });
    }

    const isOTPValid = otpService.verifyOTP(email, otp);
 
    if (!isOTPValid) {
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please sign up again." });
    }

    const userAccessToken = generateAccessToken(existingUser);
    const userRefreshToken = generateRefreshToken(existingUser);

   
    res.cookie('user_refreshToken', userRefreshToken, { httpOnly: true, sameSite: 'None', secure: true,maxAge: 604800000  })
     .cookie('user_accessToken', userAccessToken, { httpOnly: true, sameSite: 'None', secure: true,maxAge: 900000 })
     .json({ userAccessToken,user:existingUser });

  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { sendOtp, verifyOtp };
