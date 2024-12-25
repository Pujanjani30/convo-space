import * as authController from '../controllers/auth.controller.js';

const authRoutes = (app) => {
  app.post('/auth/send-otp', authController.sendOtp);
  app.post('/auth/verify-otp', authController.verifyOtp);
}

export default authRoutes;
