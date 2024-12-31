import * as authController from '../controllers/auth.controller.js';
import verifyToken from '../middlewares/verifyToken.middleware.js';

const authRoutes = (app) => {
  // Public routes
  app.post('/auth/send-otp', authController.sendOtp);
  app.post('/auth/verify-otp', authController.verifyOtp);
  app.post('/auth/refresh-token', authController.refreshAccessToken);

  // Secure routes
  app.post('/auth/logout', verifyToken, authController.logout);
}

export default authRoutes;
