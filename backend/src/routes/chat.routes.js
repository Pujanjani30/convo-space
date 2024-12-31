import * as chatController from '../controllers/chat.controller.js';
import verifyToken from '../middlewares/verifyToken.middleware.js';

const chatRoutes = (app) => {
  app.get('/chats', verifyToken, chatController.getChats);
}

export default chatRoutes;