import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error("UNAUTHORIZED");
    }

    const decodedData = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedData?.user_id).select('-user_refreshToken -user_friends');
    if (!user) {
      throw new Error("INVALID_TOKEN");
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      message: error?.message || "Invalid access token"
    });
  }
}

export default verifyToken;