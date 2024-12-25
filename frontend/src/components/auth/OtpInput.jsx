import React, { useState } from 'react';
import { verifyOtp } from '../../api/auth.js';

const OtpInput = ({ email, onEditEmail, onResendOtp }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  const handleChange = (value, index) => {
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1); // Ensure only one digit
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join('');
    setLoading(true);
    console.log(email, otpValue);
    await verifyOtp(email, otpValue);
    setLoading(false);
  };

  return (
    <div className="w-full max-w-sm mt-8">
      <h2 className="text-white text-2xl font-semibold mb-4">Enter OTP</h2>
      <p className="text-gray-400 mb-4">
        Sent to <span className="font-semibold">{email}</span>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 h-12 text-center bg-gray-700 text-white rounded-lg text-2xl outline-none focus:ring-2 focus:ring-blue-600"
            />
          ))}
        </div>
        <button
          type="submit"
          {...(loading && { disabled: true })}
          className="w-full bg-blue-600 text-black font-medium py-2 rounded-lg hover:bg-blue-700 transition mb-4"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>

      <div className="flex justify-between w-full">
        <button
          onClick={onEditEmail}
          className="text-blue-500 hover:underline text-sm"
        >
          Edit email
        </button>
        <button
          onClick={onResendOtp}
          className="text-blue-500 hover:underline text-sm"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OtpInput;
