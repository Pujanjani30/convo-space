import * as userService from '../services/user.service.js';
import { successResponse, errorResponse } from '../utils/http-response.js';
import { uploadFile } from '../utils/cloudinary.js';

const getUserProfile = async (req, res) => {
  try {
    const data = req.user;

    const response = await userService.getUserProfile(data);

    return successResponse({
      res,
      message: 'Success',
      data: response
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const searchUserByEmail = async (req, res) => {
  try {
    const email = req.query.email;
    const userId = req.user._id;

    const response = await userService.searchUserByEmail(userId, email);

    return successResponse({
      res,
      message: 'Success',
      data: response
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.user._id;

    const profilePicLocalPath = req.file?.path;

    if (profilePicLocalPath) {
      const profilePic = await uploadFile(profilePicLocalPath);
      data.user_profilePic = profilePic.url;
    }

    const response = await userService.updateUserProfile(data, userId);

    return successResponse({
      res,
      message: 'Success',
      data: response
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const sendFriendRequest = async (req, res) => {
  try {
    const { recipientEmail } = req.body;
    const senderId = req.user._id;

    if (!recipientEmail)
      throw new Error('FIELD_REQUIRED');

    await userService.sendFriendRequest(senderId, recipientEmail);

    return successResponse({
      res,
      message: 'Friend request sent'
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const recipientId = req.user._id;
    const senderId = req.body.senderId;

    console.log('req.body', req.body);

    if (!senderId)
      throw new Error('FIELD_REQUIRED');

    await userService.acceptFriendRequest(recipientId, senderId);

    return successResponse({
      res,
      message: 'Friend request accepted'
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const rejectFriendRequest = async (req, res) => {
  try {
    const recipientId = req.user._id;
    const senderId = req.body.senderId;

    if (!senderId)
      throw new Error('FIELD_REQUIRED');

    await userService.rejectFriendRequest(recipientId, senderId);

    return successResponse({
      res,
      message: 'Friend request cancelled'
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const getFriendRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const response = await userService.getFriendRequests(userId);

    return successResponse({
      res,
      message: 'Success',
      data: response
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const response = await userService.getFriends(userId);

    return successResponse({
      res,
      message: 'Success',
      data: response
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export {
  getUserProfile,
  updateUserProfile,
  searchUserByEmail,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendRequests,
  getFriends,
};