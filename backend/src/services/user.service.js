import User from "../models/user.model.js";

const getUserProfile = async (data) => {
  const { _id } = data;

  const user = await User.findById(_id).select("-user_refreshToken -user_friends");
  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

const searchUserByEmail = async (userId, email) => {
  const conditions = {
    _id: { $ne: userId },
    user_email: { $regex: new RegExp(email, "i") }
  }

  const searchResult = await User.find(conditions)
    .select("-user_refreshToken -user_friends -user_friendRequests");

  return searchResult;
};

const updateUserProfile = async (data, userId) => {
  data.user_isNew = false;

  const user = await User.findByIdAndUpdate(userId, data, { new: true })
    .select("-user_refreshToken -user_friends");

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};

const sendFriendRequest = async (senderId, recipientEmail) => {
  const recipient = await User.findOne({ user_email: recipientEmail });
  if (!recipient)
    throw new Error("USER_NOT_FOUND");

  // Check if the sender and recipient are the same
  if (senderId === recipient._id.toString())
    throw new Error("CANNOT_SEND_REQUEST_TO_SELF");

  // Check if the sender has already sent a friend request
  if (recipient.user_friendRequests.includes(senderId))
    throw new Error("FRINED_REQUEST_ALREADY_SENT");

  // Save the friend request in the recipient's document
  recipient.user_friendRequests.push(senderId);
  await recipient.save();
};

const acceptFriendRequest = async (recipientId, senderId) => {
  const recipient = await User.findById(recipientId);
  const sender = await User.findById(senderId);

  if (!recipient || !sender)
    throw new Error("USER_NOT_FOUND");

  // Check if the sender has sent a friend request
  if (!recipient.user_friendRequests.includes(senderId))
    throw new Error("FRINED_REQUEST_NOT_FOUND");

  // Remove the friend request from the recipient
  recipient.user_friendRequests = recipient.user_friendRequests
    .filter((id) => id.toString() !== senderId);

  // Add the sender to the recipient's friends
  recipient.user_friends.push(senderId);
  await recipient.save();

  // Add the recipient to the sender's friends
  sender.user_friends.push(recipientId);
  await sender.save();
};

const rejectFriendRequest = async (recipientId, senderId) => {
  const recipient = await User.findById(recipientId);
  const sender = await User.findById(senderId);

  if (!recipient || !sender)
    throw new Error("USER_NOT_FOUND");

  // Check if the sender has sent a friend request
  if (!recipient.user_friendRequests.includes(senderId))
    throw new Error("FRINED_REQUEST_NOT_FOUND");

  // Remove the friend request from the recipient
  recipient.user_friendRequests = recipient.user_friendRequests
    .filter((id) => id.toString() !== senderId);

  await recipient.save();
}

const getFriendRequests = async (userId) => {
  const user = await User.findById(userId)
    .select("user_friendRequests")
    .populate("user_friendRequests");

  if (!user)
    throw new Error("USER_NOT_FOUND");

  const friendRequests = user.user_friendRequests.map((request) => ({
    _id: request._id,
    user_name: request.user_name,
    user_email: request.user_email,
    user_profilePic: request.user_profilePic,
  }));

  return friendRequests;
};

const getFriends = async (userId) => {
  const user = await User.findById(userId)
    .select("user_friends")
    .populate("user_friends");

  if (!user)
    throw new Error("USER_NOT_FOUND");

  return user.user_friends;
};

export {
  getUserProfile,
  searchUserByEmail,
  updateUserProfile,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
};