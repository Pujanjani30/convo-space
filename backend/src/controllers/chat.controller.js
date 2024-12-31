import * as chatService from '../services/chat.service.js';
import { successResponse, errorResponse } from '../utils/http-response.js';

const getChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const response = await chatService.getChats(userId);

    return successResponse({
      res,
      message: 'Chats fetched successfully',
      data: response
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

export { getChats };