jest.mock('ioredis', () => ({
  Redis: jest.fn().mockImplementation(() => ({})),
}));

import { redis } from './redis.js';

describe('redis', () => {
  it('should export a redis instance', () => {
    expect(redis).toBeDefined();
  });
});