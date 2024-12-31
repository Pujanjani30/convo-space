import React, { useState, useEffect } from 'react'
import AuthContext from './AuthContext.js';
import { useNavigate } from "react-router-dom";
import api from '../api/config.js';
import Cookies from 'js-cookie';
import { useSocket } from "../context/SocketContext";

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const socket = useSocket();

  const sendOtp = async (email) => {
    try {
      setLoading(true);
      const { data } = await api.post('/auth/send-otp', { email });
      return { success: true, message: data.message };
    }
    catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to send OTP" };
    } finally {
      setLoading(false);
    }
  }

  const verifyOtp = async (email, otp) => {
    try {
      setLoading(true);
      const response = await api.post('/auth/verify-otp', { email, otp });
      Cookies.set('user', JSON.stringify(response.data.data)); // Set user in cookie
      setUser(response.data.data); // Set user in context
      return { success: true };
    }
    catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to verify OTP" };
    } finally {
      setLoading(false);
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout');
      Cookies.remove('user');

      if (socket && socket.connected) {
        socket.disconnect();
      }

      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Logout failed", error);
    }
  }

  useEffect(() => {
    const user = Cookies.get('user');
    if (user) {
      setUser(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, sendOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContextProvider;