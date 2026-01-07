import { checkOtpRestrictions, trackOtpRequest, sendOtp } from './auth.helpers';
import { redis } from '@e-shop/redis';
import { ValidationError } from '@e-shop/common';

// Mock dependencies
jest.mock('@e-shop/redis');

const mockedRedis = redis as jest.Mocked<typeof redis>;

jest.mock('./email.helpers', () => ({
  sendEmail: jest.fn(),
}));

const mockedSendEmail = require('./email.helpers').sendEmail;

describe('Auth Helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkOtpRestrictions', () => {
    it('should throw error if otp_lock is set', async () => {
      mockedRedis.get.mockResolvedValueOnce('locked');

      await expect(checkOtpRestrictions('test@example.com')).rejects.toThrow(
        ValidationError,
      );
      expect(mockedRedis.get).toHaveBeenCalledWith('otp_lock:test@example.com');
    });

    it('should throw error if otp_spam_lock is set', async () => {
      mockedRedis.get
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('locked');

      await expect(checkOtpRestrictions('test@example.com')).rejects.toThrow(
        ValidationError,
      );
    });

    it('should throw error if otp_cooldown is set', async () => {
      mockedRedis.get
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce('true');

      await expect(checkOtpRestrictions('test@example.com')).rejects.toThrow(
        ValidationError,
      );
    });

    it('should not throw if no restrictions', async () => {
      mockedRedis.get.mockResolvedValue(null);

      await expect(
        checkOtpRestrictions('test@example.com'),
      ).resolves.not.toThrow();
    });
  });

  describe('trackOtpRequest', () => {
    it('should increment request count', async () => {
      mockedRedis.get.mockResolvedValue('1');
      mockedRedis.set.mockResolvedValue('OK');

      await expect(trackOtpRequest('test@example.com')).resolves.not.toThrow();

      expect(mockedRedis.set).toHaveBeenCalledWith(
        'otp_request_count:test@example.com',
        2,
        'EX',
        3600,
      );
    });

    it('should lock if too many requests', async () => {
      mockedRedis.get.mockResolvedValue('2');

      await expect(trackOtpRequest('test@example.com')).rejects.toThrow(
        ValidationError,
      );

      expect(mockedRedis.set).toHaveBeenCalledWith(
        'otp_spam_lock:test@example.com',
        'locked',
        'EX',
        3600,
      );
    });
  });

  describe('sendOtp', () => {
    it('should send OTP email and save to redis', async () => {
      mockedSendEmail.mockResolvedValue(true);
      mockedRedis.set.mockResolvedValue('OK');

      await expect(
        sendOtp('test@example.com', 'John Doe', 'user-registration-otp'),
      ).resolves.not.toThrow();

      expect(mockedSendEmail).toHaveBeenCalledWith(
        'test@example.com',
        'Verify your email',
        'user-registration-otp',
        expect.objectContaining({
          name: 'John Doe',
          otp: expect.any(String),
        }),
      );

      expect(mockedRedis.set).toHaveBeenCalledTimes(2); // OTP and cooldown
    });
  });
});
