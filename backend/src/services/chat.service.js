import Message from "../models/message.model.js";
import mongoose from "mongoose";

const getChats = async (userId) => {
  const chats = await Message.aggregate([
    {
      $match: {
        $or: [
          { senderId: new mongoose.Types.ObjectId(userId) },
          { recipientId: new mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $sort: { timestamp: -1 } // Sorting by custom timestamp field
    },
    {
      $group: {
        _id: {
          otherUser: {
            $cond: {
              if: { $eq: ['$senderId', new mongoose.Types.ObjectId(userId)] },
              then: '$recipientId',
              else: '$senderId'
            }
          }
        },
        lastMessage: { $first: '$text' },
        lastTimestamp: { $first: '$timestamp' },
        isSeen: { $first: '$isSeen' }
      }
    },
    {
      $lookup: {
        from: 'users', // Name of the User collection
        localField: '_id.otherUser',
        foreignField: '_id',
        as: 'otherUserDetails'
      }
    },
    {
      $addFields: {
        otherUser: { $arrayElemAt: ['$otherUserDetails.user_name', 0] },
        otherUserProfilePic: { $arrayElemAt: ['$otherUserDetails.user_profilePic', 0] }
      }
    },
    {
      $project: {
        _id: '$_id.otherUser',
        otherUser: 1,
        otherUserProfilePic: 1,
        lastMessage: 1,
        lastTimestamp: 1,
        isSeen: 1
      }
    },
    {
      $sort: { lastTimestamp: -1 }
    }
  ]);

  return chats;
};


export { getChats };