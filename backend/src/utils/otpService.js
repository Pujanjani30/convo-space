import crypto from 'crypto';
import { sendEmail } from './emailService.js';
import Otp from '../models/otp.model.js';
import { create } from 'domain';

const generateOTP = () => {
  return crypto.randomInt(100000, 999999);
};

const verifyReceivedOtp = async (email, otp) => {
  try {
    const otpRecord = await Otp.findOne({ otp_user_email: email }).sort({ createdAt: -1 });
    if (!otpRecord) {
      throw new Error("OTP_NOT_FOUND");
    }

    return otpRecord.otp_code === otp;
  } catch (error) {
    console.error("Error verifying OTP: ", error);
    throw new Error("Error verifying OTP");
  }
};

const sendOtpToEmail = async (email) => {
  try {
    const otp = generateOTP();

    await sendEmail(email, otp);

    return otp;
  } catch (error) {
    console.error("Error sending OTP: ", error);
    throw new Error("Error sending OTP");
  }
}


export { generateOTP, sendOtpToEmail, verifyReceivedOtp };