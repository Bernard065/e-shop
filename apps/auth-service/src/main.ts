import express from 'express';
import cors from 'cors';
import { errorMiddleware } from '@e-shop/common';
import cookieParser from 'cookie-parser';
import { connectRedis, disconnectRedis } from '@e-shop/redis';

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:4200',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(cookieParser());

app.get('/', (req, res) => {
  res.send({ message: 'Hello from Auth Service' });
});

// Health check endpoint
app.get('/health', async (req, res) => {
  res.status(200).json({ status: 'ok', service: 'auth' });
});

app.use(errorMiddleware);

const port = process.env.AUTH_PORT || 6001;

async function bootstrap() {
  try {
    // Connect to Redis before starting the server
    await connectRedis();
    console.log('Redis connection established');

    const server = app.listen(port, () => {
      console.log(`Auth Service is running on port ${port}`);
    });

    server.on('error', (error) => {
      console.error('Error starting server:', error);
      process.exit(1);
    });

    // Graceful shutdown handling
    const gracefulShutdown = async (signal: string) => {
      console.log(`${signal} received, shutting down gracefully`);

      server.close(async () => {
        console.log('HTTP server closed');

        try {
          await disconnectRedis();
          console.log('All connections closed');
          process.exit(0);
        } catch (error) {
          console.error('Error during shutdown:', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    console.error('Failed to start Auth Service:', error);
    process.exit(1);
  }
}

bootstrap();
