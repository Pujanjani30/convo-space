// React and hooks
import React, { useState, useContext } from 'react';

// External Packages
import * as Yup from 'yup';

// Context
import AuthContext from '../../context/AuthContext.js';

// Assets
import PeopleChatting from '../../assets/people_chatting.svg'
import ChatIcon from '../../assets/chat_icon.png'

// Components
import OtpInput from './OtpInput.jsx';

// Utils
import { showSuccessToast, showErrorToast } from '../../utils/toast.js';

// Login Component
const Login = () => {
  const { sendOtp, loading } = useContext(AuthContext);
  const [showOtp, setShowOtp] = useState(false);
  const [email, setEmail] = useState("");

  // Validation Schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleSendOtp = async (e) => {
    e.preventDefault();

    try {
      await validationSchema.validate({ email }); // Validate email

      const response = await sendOtp(email);
      if (response.success) {
        setShowOtp(true);
        showSuccessToast(response.message);
      }
      else {
        showErrorToast(response.message);
      }
    } catch (error) {
      showErrorToast(error.message);
    }
  };

  const handleEditEmail = () => {
    setShowOtp(false);
  };

  const handleResendOtp = async () => {
    const response = await sendOtp(email);
    if (response.success) {
      showSuccessToast(response.message);
    }
    else {
      showErrorToast(response.message);
    }
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

        {/* If showOtp is false, show the email form else show the OTP form */}
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
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                placeholder="Enter email"
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
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
