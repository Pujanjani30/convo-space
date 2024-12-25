// emailService.js
import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send OTP email function
const sendEmail = async (email, otp) => {
  try {
    const transporter = createTransporter();

    // Send OTP email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP for ConvoSpace Login',
      text: `Your OTP for ConvoSpace Login is ${otp}`,
    });

    console.log('Message sent: %s', info.messageId);
  } catch (error) {
    console.error("Error sending OTP email: ", error);
    throw new Error("Error sending OTP email");
  }
};

export { sendEmail };
