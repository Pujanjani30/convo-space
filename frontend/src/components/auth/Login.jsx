import React, { useState } from 'react';
import PeopleChatting from '../../assets/people_chatting.svg'
import ChatIcon from '../../assets/chat_icon.png'
import OtpInput from './OtpInput';
import { sendOtp } from '../../api/auth.js';

const Login = () => {
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (email) {
      setLoading(true);
      await sendOtp(email);
      setShowOtp(true);
      setLoading(false);
    }
  };

  const handleEditEmail = () => {
    setShowOtp(false);
  };

  const handleResendOtp = async () => {
    setOtp(["", "", "", "", "", ""]);
    await sendOtp(email);
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Left Section */}
      <div className="md:w-1/2 bg-gray-800 flex flex-col justify-center items-center p-10">
        {/* Logo */}
        <div className="flex items-center mb-10">
          <div className="w-10 h-10 mr-2">
            <img src={ChatIcon} alt="Chat Icon" />
          </div>
          <h1 className="text-white text-2xl font-semibold">ConvoSpace</h1>
        </div>
        <div className="w-3/4">
          <img
            src={PeopleChatting}
            alt="People chatting"
            className="rounded-md"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="md:w-1/2 bg-black flex flex-col justify-center items-center p-10">
        <h2 className="text-white text-4xl font-semibold mb-8">Login</h2>
        {!showOtp ? (
          <form className="w-full max-w-sm" onSubmit={handleSendOtp}>
            {/* Email */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-400 font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            {/* Submit Button */}

            <button
              type="submit"
              {...(loading && { disabled: true })}
              className="w-full bg-blue-600 text-black font-medium py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        ) : (
          <OtpInput
            email={email}
            onEditEmail={handleEditEmail}
            onResendOtp={handleResendOtp}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
