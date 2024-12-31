import * as userController from '../controllers/user.controller.js';
import verifyToken from '../middlewares/verifyToken.middleware.js';
import { upload } from '../middlewares/multer.middlerware.js';

const userRoutes = (app) => {
  // GET Routes
  app.get('/user/profile', verifyToken, userController.getUserProfile);
  app.get('/user/search', verifyToken, userController.searchUserByEmail);
  app.get('/user/friend-requests', verifyToken, userController.getFriendRequests);
  app.get('/user/friends', verifyToken, userController.getFriends);

  // POST Routes
  app.post('/user/send-friend-request', verifyToken, userController.sendFriendRequest);
  app.post('/user/accept-friend-request', verifyToken, userController.acceptFriendRequest);
  app.post('/user/reject-friend-request', verifyToken, userController.rejectFriendRequest);

  // PUT Routes
  app.put('/user/profile',
    verifyToken, upload.single('user_profilePic'),
    userController.updateUserProfile
  );
}

export default userRoutes;
