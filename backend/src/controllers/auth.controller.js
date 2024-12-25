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
    return errorResponse(res, error.message);
  }
}

const verifyOtp = async (req, res) => {
  try {
    const data = Object.assign({}, req.body, req.params, req.query);

    const response = await authService.verifyOtp(data);

    return successResponse({
      res,
      message: 'OTP verified successfully',
      data: response
    });
  } catch (error) {
    return errorResponse(res, error.message);
  }
}

export { sendOtp, verifyOtp };
