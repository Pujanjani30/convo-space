import api from "./config.js";
import Cookie from "js-cookie";

export const getUserProfile = async () => {
  try {
    const { data } = await api.get("/user/profile");
    return { success: true, userData: data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to get user profile" };
  }
}

export const updateUserProfile = async (formData) => {
  try {
    api.defaults.headers["Content-Type"] = "multipart/form-data";

    const { data } = await api.put("/user/profile", formData);

    Cookie.set("user", JSON.stringify(data.data));

    api.defaults.headers["Content-Type"] = "application/json";

    return { success: true, message: data.message, userData: data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to update user profile" };
  }
}

export const searchUserByEmail = async (email) => {
  try {
    const { data } = await api.get(`/user/search?email=${email}`);
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to search user by email" };
  }
}

export const sendFriendRequest = async (email) => {
  try {
    const { data } = await api.post("/user/send-friend-request", { recipientEmail: email });
    return { success: true, message: data.message, statusCode: data.status };
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.status,
      message: error.response?.data?.message || "Failed to send friend request"
    };
  }
}

export const getFriendRequests = async () => {
  try {
    const { data } = await api.get("/user/friend-requests");
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to get friend requests" };
  }
}

export const getFriends = async () => {
  try {
    const { data } = await api.get("/user/friends");
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, message: error.response?.data?.message || "Failed to get friends" };
  }
}

export const acceptFriendRequest = async (senderId) => {
  try {
    const { data } = await api.post("/user/accept-friend-request", { senderId });
    return { success: true, message: data.message, statusCode: data.status };
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.status,
      message: error.response?.data?.message || "Failed to accept friend request"
    };
  }
}

export const rejectFriendRequest = async (senderId) => {
  try {
    const { data } = await api.post("/user/reject-friend-request", { senderId });
    return { success: true, message: data.message, statusCode: data.status };
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.status,
      message: error.response?.data?.message || "Failed to reject friend request"
    };
  }
}