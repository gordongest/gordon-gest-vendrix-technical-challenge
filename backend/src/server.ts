import http from 'http';
import dotenv from 'dotenv'
import app from './app';
// -------------------------------------------------------------
dotenv.config();
// -------------------------------------------------------------

// Connect to MongoDB and Start Server
const PORT = process.env.PORT || 8085;

const server = http.createServer(app);

const startServer = async () => {
  server
    .listen(PORT, () => {
      console.log(
        `Backend server running in ${process.env.NODE_ENV} mode on port ${PORT}`
      );
    })
    .on('error', () => {
      console.error('Some Error');
    });
};

export default startServer();
