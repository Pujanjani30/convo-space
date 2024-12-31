import React, { useState, useContext } from 'react';
import { showSuccessToast, showErrorToast } from '../../utils/toast.js';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext.js';
import Cookies from 'js-cookie';

const OtpInput = ({ email, onEditEmail, onResendOtp }) => {
  const { verifyOtp, loading } = useContext(AuthContext);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const navigate = useNavigate();

  const handleChange = (value, index) => {
    if (!/^\d$/.test(value) && value !== "") return; // Allow only digits
    const updatedOtp = [...otp];
    updatedOtp[index] = value.slice(-1); // Ensure only one digit
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    // if (value && index === otp.length - 1) {
    //   document.getElementById(`otp-${index}`).blur();
    // }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`).focus();
      }
    }

    if (e.key === "Enter") {
      e.preventDefault();
      document.getElementById("otp-submit-button").click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const otpValue = otp.join('');
    if (otpValue.length < 6) {
      showErrorToast('Please enter a valid OTP');
      return;
    }

    try {
      const response = await verifyOtp(email, otpValue);
      if (response.success) {
        showSuccessToast('OTP verified successfully');

        let user = Cookies.get('user');
        user = JSON.parse(user);
        user.user_isNew ? navigate('/profile') : navigate('/chats');
      } else {
        showErrorToast(response.message);
      }
    } catch (error) {
      showErrorToast(error);
    }
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
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center bg-gray-700 text-white rounded-lg text-2xl outline-none focus:ring-2 focus:ring-blue-600"
            />
          ))}
        </div>
        <button
          type="submit"
          id="otp-submit-button"
          disabled={loading}
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
          onClick={() => {
            onResendOtp();
            setOtp(["", "", "", "", "", ""]);
          }}
          className="text-blue-500 hover:underline text-sm"
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default OtpInput;
