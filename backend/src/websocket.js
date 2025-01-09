// import mongoose from 'mongoose';
import { Server } from 'socket.io';
import { saveMessage } from './services/message.service.js';
import { getChats } from './services/chat.service.js';
import { updateUserLastSeen } from './services/user.service.js';

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

    // Emit the online status only to other connected users
    // socket.broadcast.emit('userOnline', userId);

    socket.on('sendMessage', async (messageData) => {
      const { text, senderId, recipientId, timestamp } = messageData;

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

    socket.on('disconnect', async () => {
      for (const [id, socketId] of users.entries()) {
        if (socketId === socket.id) {
          users.delete(id);

          // Emit the offline status to other connected users
          // socket.broadcast.emit('userOffline', id);

          break;
        }
      }
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export default initializeWebSocket;