import ERRORS from '../config/error.config.js';

const successResponse = ({ res, data = undefined, message, token = undefined }) => {
  res.status(200).json({
    status: 200,
    message,
    data,
    token
  });
}

const errorResponse = (res, err) => {
  console.log(err);

  let error = ERRORS[err.message];

  if (!error) error = ERRORS['DEFAULT_ERROR'];

  res.status(error.HTTP_CODE).json({
    status: error.HTTP_CODE || 500,
    message: error.DEFAULT_MESSAGE
  });
}

export { successResponse, errorResponse };