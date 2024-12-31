const ERRORS = {
  'DEFAULT_ERROR': {
    'CODE': 0,
    'DEFAULT_MESSAGE': 'Internal server error.',
    'HTTP_CODE': 500
  },
  'DATA_NOT_FOUND': {
    'CODE': 1,
    'DEFAULT_MESSAGE': 'Data is not found',
    'HTTP_CODE': 404
  },
  'ALREADY_EXISTS': {
    'CODE': 2,
    'DEFAULT_MESSAGE': 'Already exists.',
    'HTTP_CODE': 409
  },
  'SERVER_ERROR': {
    'CODE': 3,
    'DEFAULT_MESSAGE': 'Server error. Please try again after some time.',
    'HTTP_CODE': 500
  },
  'USER_NOT_FOUND': {
    'CODE': 4,
    'DEFAULT_MESSAGE': 'User not found.',
    'HTTP_CODE': 404
  },
  'INVALID_CREDENTIALS': {
    'CODE': 9,
    'DEFAULT_MESSAGE': 'Invalid credentials.',
    'HTTP_CODE': 400
  },
  'UNAUTHORIZED': {
    'CODE': 10,
    'DEFAULT_MESSAGE': 'Unauthorized.',
    'HTTP_CODE': 401
  },
  'AUTH_NOT_FOUND': {
    'CODE': 11,
    'DEFAULT_MESSAGE': 'authorization token not found.',
    'HTTP_CODE': 401
  },
  'SOMETHING_WENT_WRONG': {
    'CODE': 12,
    'DEFAULT_MESSAGE': 'Something went worng. Please try again.',
    'HTTP_CODE': 500
  },
  "INVALID_TOKEN": {
    "CODE": 13,
    "DEFAULT_MESSAGE": "Invalid token.",
    "HTTP_CODE": 401
  },
  "INVALID_OTP": {
    "CODE": 14,
    "DEFAULT_MESSAGE": "Invalid OTP.",
    "HTTP_CODE": 400
  },
  "OTP_EXPIRED": {
    "CODE": 15,
    "DEFAULT_MESSAGE": "OTP expired.",
    "HTTP_CODE": 400
  },
  "FRINED_REQUEST_ALREADY_SENT": {
    "CODE": 16,
    "DEFAULT_MESSAGE": "Friend request already sent.",
    "HTTP_CODE": 400
  },
  "FRINED_REQUEST_NOT_FOUND": {
    "CODE": 17,
    "DEFAULT_MESSAGE": "Friend request not found.",
    "HTTP_CODE": 400
  },
  "CANNOT_SEND_REQUEST_TO_SELF": {
    "CODE": 18,
    "DEFAULT_MESSAGE": "Cannot send friend request to self.",
    "HTTP_CODE": 400
  },
  "FIELD_REQUIRED": {
    "CODE": 18,
    "DEFAULT_MESSAGE": "Missing required fields.",
    "HTTP_CODE": 400
  },
}

export default ERRORS;