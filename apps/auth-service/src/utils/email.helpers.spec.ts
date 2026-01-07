import { sendEmail, renderEmailTemplate } from './email.helpers';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

// Mock dependencies
jest.mock('nodemailer');
jest.mock('ejs');
jest.mock('path');
jest.mock('dotenv');

const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;
const mockedEjs = ejs as jest.Mocked<typeof ejs>;
const mockedPath = path as jest.Mocked<typeof path>;

describe('Email Helpers', () => {
  let mockTransporter: {
    sendMail: jest.Mock;
    verify: jest.Mock;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Setup Env Vars
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SERVICE = 'gmail';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASSWORD = 'password';

    // Setup Transporter Mock with explicit Jest functions
    mockTransporter = {
      sendMail: jest.fn().mockResolvedValue({ messageId: '123' }),
      verify: jest.fn().mockResolvedValue(true),
    };

    mockedNodemailer.createTransport.mockReturnValue(
      mockTransporter as unknown as nodemailer.Transporter,
    );

    // Mock path resolve
    mockedPath.resolve.mockReturnValue('/mocked/path/template.ejs');
  });

  describe('renderEmailTemplate', () => {
    it('should render template successfully', async () => {
      const data = { name: 'John' };
      mockedEjs.renderFile.mockResolvedValue('<html>Content</html>');

      const result = await renderEmailTemplate('test-template', data);

      expect(mockedPath.resolve).toHaveBeenCalled();
      expect(mockedEjs.renderFile).toHaveBeenCalledWith(
        '/mocked/path/template.ejs',
        data,
      );
      expect(result).toBe('<html>Content</html>');
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      mockedEjs.renderFile.mockResolvedValue('<html>Content</html>');

      await sendEmail('user@test.com', 'Subject', 'otp-template', {
        code: 123,
      });

      // Verify createTransport config
      expect(mockedNodemailer.createTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: 'smtp.example.com',
          auth: { user: 'test@example.com', pass: 'password' },
        }),
      );

      // Verify sendMail call
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: expect.stringContaining('Hakika Support'),
        to: 'user@test.com',
        subject: 'Subject',
        html: '<html>Content</html>',
      });
    });

    it('should throw error if env vars are missing', async () => {
      // Delete a required variable to trigger validation
      delete process.env.SMTP_HOST;

      await expect(
        sendEmail('user@test.com', 'Subject', 'tpl', {}),
      ).rejects.toThrow('Missing required environment variables');
    });
  });
});
