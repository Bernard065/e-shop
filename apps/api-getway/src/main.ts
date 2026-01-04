import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import multer from 'multer';
import proxy from 'express-http-proxy';

const app = express();

// Environment Validation
const requiredEnvVars = ['CLIENT_URL'];
if (process.env.NODE_ENV === 'production') {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      throw new Error(
        `${envVar} environment variable is required in production`,
      );
    }
  }
}

// CORS Configuration
const ALLOWED_ORIGINS = (
  process.env.CLIENT_URL || 'http://localhost:4200'
).split(',');

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 3600,
  }),
);

// Security Headers
app.use(helmet());

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Body Parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Cookie Parser
app.use(cookieParser());

// Trust Proxy
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// File Upload Configuration
const uploadStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const extension = file.originalname.split('.').pop();
    cb(null, `${uniqueSuffix}.${extension}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowedImageTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  const allowedDocTypes = ['text/csv', 'application/pdf'];
  const allowedTypes = [...allowedImageTypes, ...allowedDocTypes];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Invalid file type:  ${file.mimetype}. Allowed types: ${allowedTypes.join(', ')}`,
      ),
    );
  }
};

const upload = multer({
  storage: uploadStorage,
  limits: {
    fileSize: 100 * 1024 * 1024,
    files: 10,
  },
  fileFilter,
});

const largeJsonLimit = express.json({ limit: '100mb' });

// Health Check Endpoint
app.get('/gateway-health', (req: Request, res: Response) => {
  return res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API Welcome Endpoint
app.get('/', (req: Request, res: Response) => {
  return res.json({ message: 'Welcome to e-shop API gateway!' });
});

// Single product image upload
app.post(
  '/products/image',
  upload.single('image'),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    return res.json({
      message: 'Image uploaded successfully',
      filename: req.file.filename,
      size: req.file.size,
    });
  },
);

// Multiple product images upload
app.post(
  '/products/images',
  upload.array('images', 10),
  (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    return res.json({
      message: 'Images uploaded successfully',
      files: files.map((f) => ({ filename: f.filename, size: f.size })),
    });
  },
);

// Bulk product import
app.post(
  '/products/bulk-import',
  largeJsonLimit,
  (req: Request, res: Response) => {
    const products = req.body.products;
    if (!Array.isArray(products)) {
      return res
        .status(400)
        .json({ error: 'Invalid payload: products array required' });
    }
    return res.json({
      message: 'Bulk import received',
      count: products.length,
    });
  },
);

// Proxy Configuration (AFTER local routes)
const AUTH_SERVICE_URL =
  process.env.AUTH_SERVICE_URL || 'http://localhost:6001';

app.use(
  '/auth',
  proxy(AUTH_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/auth${req.url}`,
  }),
);

// 404 Handler
app.use((req: Request, res: Response) => {
  return res.status(404).json({ error: 'Not found' });
});

// Global Error Handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(413)
        .json({ error: 'File too large.  Maximum size is 100MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res
        .status(400)
        .json({ error: 'Too many files. Maximum is 10 files.' });
    }
    return res.status(400).json({ error: err.message });
  }

  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS policy violation' });
  }

  if (err.message.startsWith('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  return res.status(statusCode).json({
    error:
      process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
  });
});

// Server Initialization
const port = process.env.API_PORT || 8080;

const server = app.listen(port, () => {
  console.log(`🚀 E-Shop API Gateway running at http://localhost:${port}/api`);
  console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Allowed origins: ${ALLOWED_ORIGINS.join(', ')}`);
});

// Graceful Shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n${signal} received.  Shutting down gracefully...`);
  server.close(() => {
    console.log('✅ HTTP server closed.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error(
      'Could not close connections in time, forcefully shutting down',
    );
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});

export default app;
