import * as authService from '../services/auth.service.js';
import { successResponse, errorResponse } from '../utils/http-response.js';

const sendOtp = async (req, res) => {
  try {
    const data = Object.assign({}, req.body, req.params, req.query);

    await authService.sendOtp(data);

    return successResponse({
      res,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    return errorResponse(res, error);
  }
}

const verifyOtp = async (req, res) => {
  try {
    const data = Object.assign({}, req.body, req.params, req.query);

    const response = await authService.verifyOtp(data);

    const options = {
      httpOnly: true,
      secure: true
    }

    res.cookie('accessToken', response.accessToken, options);
    res.cookie('refreshToken', response.refreshToken, options);

    return successResponse({
      res,
      message: 'OTP verified successfully',
      data: response.userData
    });
  } catch (error) {
    return errorResponse(res, error);
  }
}

const logout = async (req, res) => {
  try {
    const data = req.user;
    await authService.logout(data);

    const options = {
      httpOnly: true,
      secure: true
    }

    res.clearCookie('accessToken', options);
    res.clearCookie('refreshToken', options);

    return successResponse({
      res,
      message: 'Logged out successfully'
    });
  } catch (error) {
    return errorResponse(res, error);
  }
}

const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken;
    if (!incomingRefreshToken) {
      throw new Error('UNAUTHORIZED');
    }

    const response = await authService.refreshAccessToken({ incomingRefreshToken });

    const options = {
      httpOnly: true,
      secure: true
    }

    res.cookie('accessToken', response.accessToken, options);

    return successResponse({
      res,
      message: 'Access token refreshed successfully',
    });
  } catch (error) {
    return errorResponse(res, error);
  }
}

export { sendOtp, verifyOtp, logout, refreshAccessToken };
