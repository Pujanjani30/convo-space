import Message from '../models/message.model.js';


const getMessages = async (senderId, recipientId) => {
  const messages = await Message.find({
    $or: [
      { senderId, recipientId },
      { senderId: recipientId, recipientId: senderId }
    ]
  }).sort({ timestamp: 1 });

  return messages;
}

const saveMessage = async (data) => {
  const message = new Message({
    text: data.text,
    senderId: data.senderId,
    recipientId: data.recipientId,
    timestamp: data?.timestamp || new Date().toISOString(),
  });

  await message.save();

  return message;
}

const getUnseenMessages = async (userId) => {
  const messages = await Message.find({
    recipientId: userId,
    isSeen: false
  }).populate('senderId', 'user_name user_profilePic'); // Populate sender's info

  return messages;
}

const deleteMessage = async (ids) => {
  await Message.deleteMany({ _id: { $in: ids } });
}

export { getMessages, saveMessage, deleteMessage, getUnseenMessages };