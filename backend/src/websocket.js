// import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { getMessages, saveMessage, getUnseenMessages } from './services/message.service.js';
import { getChats } from './services/chat.service.js';

const initializeWebSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // A map to store users' socket ids
  const users = new Map();

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);
    const userId = socket.handshake.query.userId;

    users.set(userId, socket.id);
    socket.join(userId);

    socket.on('sendMessage', async (messageData) => {
      const { text, senderId, recipientId, timestamp } = messageData;

      // const senderObjectId = new mongoose.Types.ObjectId(senderId);
      // const recipientObjectId = new mongoose.Types.ObjectId(recipientId);

      try {
        const newMessage = await saveMessage({
          text,
          senderId,
          recipientId,
          timestamp: new Date(timestamp)
        })

        // Emit the new message to the recipient if they are connected
        const recipientSocketId = users.get(recipientId);
        console.log('recipientSocketId:', recipientSocketId);

        if (recipientSocketId) {
          io.to(recipientId).emit('receiveMessage', newMessage);
        } else {
          console.log(`Recipient ${recipientId} not connected`);
        }

        // Update the sender's sidebar with the new message
        const updateSidebarData = await getChats(senderId);
        io.to(senderId).emit('updateSidebar', updateSidebarData);

        // Update the recipient's sidebar with the new message
        const updateRecipientSidebarData = await getChats(recipientId);
        io.to(recipientId).emit('updateSidebar', updateRecipientSidebarData);

      } catch (error) {
        console.error(error);
        socket.emit('error', { message: error.message || 'Message could not be sent' });
      }
    });

    socket.on('disconnect', () => {
      for (const [userId, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(userId);
          break;
        }
      }
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export default initializeWebSocket;