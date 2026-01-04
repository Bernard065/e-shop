import express from 'express';
import cors from 'cors';

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

app.get('/', (req, res) => {
  res.send({ message: 'Hello from Auth Service' });
});

const port = process.env.AUTH_PORT || 6001;

const server = app.listen(port, () => {
  console.log(`Auth Service is running on port ${port}`);
});

server.on('error', (error) => {
  console.error('Error starting server:', error);
});
