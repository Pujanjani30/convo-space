import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp_user_email: {
    type: String,
    required: true,
    trim: true,
  },
  otp_code: {
    type: String,
    required: true,
    trim: true,
  },
  otp_expiry: {
    type: Date,
    required: true,
    expires: 300,
  },
}, { timestamps: true });

export default mongoose.model("Otp", otpSchema);