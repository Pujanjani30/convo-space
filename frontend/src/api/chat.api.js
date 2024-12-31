import api from "./config.js";

export const getChats = async () => {
  try {
    const { data } = await api.get("/chats");
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to get chats" };
  }
}

export const getMessages = async (userId, recipientId) => {
  try {
    const { data } = await api.get(`/messages?senderId=${userId}&recipientId=${recipientId}`);
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to get messages" };
  }
}

export const deleteMessage = async (messageIds) => {
  try {
    await api.delete(`/messages`, { data: messageIds });
    return { success: true };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to delete message" };
  }
}