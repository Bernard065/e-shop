import { Redis } from 'ioredis';

// Parse Redis host - remove protocol if present
const redisHost = (process.env.REDIS_HOST || '127.0.0.1').replace(
  /^https?:\/\//,
  '',
);

// Determine if TLS should be used (Upstash and other cloud Redis providers require TLS)
const useTls =
  process.env.REDIS_TLS === 'true' ||
  (process.env.REDIS_HOST?.includes('upstash.io') ?? false);

// Create Redis client with retry strategy
export const redis = new Redis({
  host: redisHost,
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  tls: useTls ? {} : undefined,
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    console.log(
      `Redis connection attempt ${times}, retrying in ${delay}ms... `,
    );
    return delay;
  },
  lazyConnect: true, // Don't connect immediately
});

// Connection event handlers
redis.on('connect', () => {
  console.log('Redis client connected');
});

redis.on('ready', () => {
  console.log('Redis client ready');
});

redis.on('error', (err) => {
  console.error('Redis client error:', err.message);
});

redis.on('close', () => {
  console.warn('Redis connection closed');
});

// Health check function
export async function checkRedisHealth(): Promise<boolean> {
  try {
    const result = await redis.ping();
    return result === 'PONG';
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

// Initialize connection (call this at app startup)
export async function connectRedis(): Promise<void> {
  try {
    await redis.connect();
    const isHealthy = await checkRedisHealth();
    if (!isHealthy) {
      throw new Error('Redis health check failed after connection');
    }
    console.log('Redis connected and healthy');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    throw error;
  }
}

// Graceful shutdown
export async function disconnectRedis(): Promise<void> {
  await redis.quit();
  console.log('Redis disconnected gracefully');
}
