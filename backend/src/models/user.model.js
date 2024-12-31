import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
    trim: true,
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  user_profilePic: {
    type: String,
    trim: true,
  },
  user_about: {
    type: String,
    trim: true,
    default: 'Hey there! I am using ConvoSpace.'
  },
  user_friends: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  user_friendRequests: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  user_isNew: {
    type: Boolean,
    default: true,
  },
  user_refreshToken: {
    type: String,
  },
}, { timestamps: true });

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign({
    user_id: this._id,
    user_name: this.user_name,
    user_email: this.user_email
  },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
}

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({
    user_id: this._id
  },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });
}

export default mongoose.model('User', userSchema);
