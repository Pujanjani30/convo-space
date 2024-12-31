import * as messageService from '../services/message.service.js';
import { successResponse, errorResponse } from '../utils/http-response.js';

const getMessages = async (req, res) => {
  try {
    const { senderId, recipientId } = req.query;
    const userId = req.user._id;

    if (userId.toString() !== senderId)
      throw new Error('Unauthorized');

    const response = await messageService.getMessages(senderId, recipientId);

    return successResponse({
      res,
      message: 'Messages fetched successfully',
      data: response
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const saveMessage = async (req, res) => {
  try {
    const data = req.body;
    await messageService.saveMessage(data);

    return successResponse({
      res,
      message: 'Message saved successfully'
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const ids = req.body;

    await messageService.deleteMessage(ids);

    return successResponse({
      res,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    return errorResponse(res, error);
  }
}

export { getMessages, deleteMessage, saveMessage };