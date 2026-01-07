import { Redis } from 'ioredis';
import {
  redis,
  checkRedisHealth,
  connectRedis,
  disconnectRedis,
} from './redis.js';

const mockRedis = redis as jest.Mocked<Redis>;

// Mock ioredis
jest.mock('ioredis', () => {
  const mockRedisInstance = {
    connect: jest.fn(),
    ping: jest.fn(),
    quit: jest.fn(),
    on: jest.fn(),
  };
  return {
    Redis: jest.fn(() => mockRedisInstance),
  };
});

describe('Redis', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkRedisHealth', () => {
    it('should return true when ping returns PONG', async () => {
      mockRedis.ping.mockResolvedValue('PONG');

      const result = await checkRedisHealth();

      expect(result).toBe(true);
      expect(mockRedis.ping).toHaveBeenCalled();
    });

    it('should return false when ping fails', async () => {
      mockRedis.ping.mockRejectedValue(new Error('Connection failed'));

      const result = await checkRedisHealth();

      expect(result).toBe(false);
    });

    it('should return false when ping returns something else', async () => {
      mockRedis.ping.mockResolvedValue('NOT PONG');

      const result = await checkRedisHealth();

      expect(result).toBe(false);
    });
  });

  describe('connectRedis', () => {
    it('should connect and check health successfully', async () => {
      mockRedis.connect.mockResolvedValue(undefined);
      mockRedis.ping.mockResolvedValue('PONG');

      await expect(connectRedis()).resolves.not.toThrow();

      expect(mockRedis.connect).toHaveBeenCalled();
      expect(mockRedis.ping).toHaveBeenCalled();
    });

    it('should throw error if health check fails', async () => {
      mockRedis.connect.mockResolvedValue(undefined);
      mockRedis.ping.mockResolvedValue('NOT PONG');

      await expect(connectRedis()).rejects.toThrow(
        'Redis health check failed after connection',
      );
    });

    it('should throw error if connect fails', async () => {
      mockRedis.connect.mockRejectedValue(new Error('Connect failed'));

      await expect(connectRedis()).rejects.toThrow('Connect failed');
    });
  });

  describe('disconnectRedis', () => {
    it('should quit redis connection', async () => {
      mockRedis.quit.mockResolvedValue('OK');

      await expect(disconnectRedis()).resolves.not.toThrow();

      expect(mockRedis.quit).toHaveBeenCalled();
    });
  });
});
