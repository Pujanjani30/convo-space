// external packages
import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';

// database connection
import './db/index.js';

// api routes setup
import createApi from './api/v1/index.js';

// WebSocket setup
import initializeWebSocket from './websocket.js';

// environment vars
const PORT = process.env.PORT || 8000;

// express app instance
const app = express();

// set security HTTP headers
app.use(helmet());

// enable cors
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));

// enable response compression
// app.use(compression());

// parse JSON request body
app.use(express.json({ limit: '10mb' }));

// serve static files from the 'public' directory
app.use(express.static('public'));

// parse URL-encoded request body
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// sanitize request data to prevent MongoDB query injection
app.use(mongoSanitize());

// health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: Date.now(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// api routes
app.use('/api/v1', createApi());

// handle 404 errors
app.use('*', (req, res) => {
  res.status(404).send('404 Not found');
});

// Create an HTTP server instance
const server = http.createServer(app);

// Initialize WebSocket server
initializeWebSocket(server);

// start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});



export default app;