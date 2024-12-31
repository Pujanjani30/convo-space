import * as messageController from '../controllers/message.controller.js';
import verifyToken from '../middlewares/verifyToken.middleware.js';

const messageRoutes = (app) => {
  app.get('/messages', verifyToken, messageController.getMessages);
  app.post('/messages', verifyToken, messageController.saveMessage);
  app.delete('/messages', verifyToken, messageController.deleteMessage);
}

export default messageRoutes;