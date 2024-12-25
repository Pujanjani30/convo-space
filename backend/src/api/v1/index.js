import express from 'express';
import routes from '../../routes/index.js'; // Single import for all routes

const createApi = () => {
  const api = express.Router();
  routes.forEach((route) => route(api)); // Register each route
  return api;
};

export default createApi;