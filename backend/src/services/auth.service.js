import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import { sendOtpToEmail, verifyReceivedOtp } from '../utils/otpService.js';
import jwt from 'jsonwebtoken';

const sendOtp = async (data) => {
  const { email } = data;
  const sentOtp = await sendOtpToEmail(email);

  await Otp.create({
    otp_user_email: email,
    otp_code: sentOtp,
    otp_expiry: new Date()
  });
}

const generateAccessAndRefreshToken = async (user) => {
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.user_refreshToken = refreshToken;
  // To avoid validation on user.save() as we are not passing all required fields in user object
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
}

const verifyOtp = async (data) => {
  const { email, otp } = data;

  const isOtpValid = await verifyReceivedOtp(email, otp);

  if (!isOtpValid) {
    throw new Error("INVALID_OTP");
  }

  await Otp.deleteOne({ otp_user_email: email, otp_code: otp });

  let user = null;
  user = await User.findOne({ user_email: email }).select('-user_refreshToken -user_friends');
  if (!user) {
    user = await User.create({
      user_name: email.split('@')[0],
      user_email: email
    });
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user);

  const userData = { ...user._doc, user_refreshToken: undefined };

  return { userData, accessToken, refreshToken };
}

const logout = async (data) => {
  const { _id } = data;

  const user = await User.findById(_id);
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  user.user_refreshToken = undefined;
  await user.save({ validateBeforeSave: false });
}

const refreshAccessToken = async (data) => {
  const { incomingRefreshToken } = data;

  const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

  const user = await User.findById(decodedToken?.user_id);
  if (!user)
    throw new Error("INVALID_TOKEN");

  if (incomingRefreshToken !== user?.user_refreshToken)
    throw new Error("INVALID_TOKEN");

  const { accessToken } = await generateAccessAndRefreshToken(user);

  return { accessToken };
}

export { sendOtp, verifyOtp, logout, refreshAccessToken };
