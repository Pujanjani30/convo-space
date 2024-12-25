import User from '../models/user.model.js';
import Otp from '../models/otp.model.js';
import { sendOtpToEmail, verifyReceivedOtp } from '../utils/otpService.js';

const sendOtp = async (data) => {
  const { email } = data;
  const sentOtp = await sendOtpToEmail(email);

  await Otp.create({
    otp_user_email: email,
    otp_code: sentOtp,
    otp_expiry: new Date()
  });
}

const verifyOtp = async (data) => {
  const { email, otp } = data;

  const isOtpValid = await verifyReceivedOtp(email, otp);

  if (!isOtpValid) {
    throw new Error("INVALID_OTP");
  }

  await Otp.deleteOne({ otp_user_email: email, otp_code: otp });

  const user = await User.findOne({ user_email: email });
  if (!user) {
    return await User.create({
      user_name: email,
      user_email: email
    });
  }

  return;
}

export { sendOtp, verifyOtp };