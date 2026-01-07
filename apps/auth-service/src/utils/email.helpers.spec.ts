import { sendEmail } from './email.helpers.js';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';

// Mock dependencies
jest.mock('nodemailer');
jest.mock('ejs');
jest.mock('path');
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

const mockedNodemailer = nodemailer as jest.Mocked<typeof nodemailer>;
const mockedEjs = ejs as jest.Mocked<typeof ejs>;
const mockedPath = path as jest.Mocked<typeof path>;

describe('Email Helpers', () => {
  let mockTransporter: jest.Mocked<
    Pick<nodemailer.Transporter, 'sendMail' | 'verify'>
  >;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock environment variables
    process.env.SMTP_HOST = 'smtp.example.com';
    process.env.SMTP_PORT = '587';
    process.env.SMTP_SERVICE = 'gmail';
    process.env.SMTP_USER = 'test@example.com';
    process.env.SMTP_PASSWORD = 'password';

    // Mock nodemailer createTransport
    mockTransporter = {
      sendMail: jest.fn(),
      verify: jest.fn().mockResolvedValue(true),
    };
    mockedNodemailer.createTransport.mockReturnValue(
      mockTransporter as unknown as nodemailer.Transporter,
    );

    // Mock path.resolve
    mockedPath.resolve.mockImplementation((...args) => args.join('/'));
  });

  describe('renderEmailTemplate', () => {
    it('should render template successfully with provided data', async () => {
      const templateName = 'user-registration-otp';
      const data = { name: 'John Doe', otp: '123456' };
      const expectedHtml = '<html>Rendered template</html>';

      mockedEjs.renderFile.mockResolvedValue(expectedHtml);

      // Import the function to trigger module initialization
      const { renderEmailTemplate } = await import('./email.helpers.js');

      const result = await renderEmailTemplate(templateName, data);

      expect(mockedPath.resolve).toHaveBeenCalledWith(
        process.cwd(),
        'src',
        'assets',
        'templates',
        `${templateName}.ejs`,
      );
      expect(mockedEjs.renderFile).toHaveBeenCalledWith(
        expect.stringContaining(`${templateName}.ejs`),
        data,
      );
      expect(result).toBe(expectedHtml);
    });

    it('should handle template rendering errors', async () => {
      const templateName = 'non-existent-template';
      const data = { name: 'John Doe' };
      const error = new Error('Template not found');

      mockedEjs.renderFile.mockRejectedValue(error);

      const { renderEmailTemplate } = await import('./email.helpers.js');

      await expect(renderEmailTemplate(templateName, data)).rejects.toThrow(
        'Template not found',
      );
    });

    it('should render template with empty data object', async () => {
      const templateName = 'user-registration-otp';
      const data = {};
      const expectedHtml = '<html>Empty data template</html>';

      mockedEjs.renderFile.mockResolvedValue(expectedHtml);

      const { renderEmailTemplate } = await import('./email.helpers.js');

      const result = await renderEmailTemplate(templateName, data);

      expect(result).toBe(expectedHtml);
    });

    it('should render template with complex data', async () => {
      const templateName = 'user-registration-otp';
      const data = {
        name: 'Jane Smith',
        otp: '789012',
        additionalInfo: { key: 'value' },
      };
      const expectedHtml = '<html>Complex data template</html>';

      mockedEjs.renderFile.mockResolvedValue(expectedHtml);

      const { renderEmailTemplate } = await import('./email.helpers.js');

      const result = await renderEmailTemplate(templateName, data);

      expect(mockedEjs.renderFile).toHaveBeenCalledWith(
        expect.any(String),
        data,
      );
      expect(result).toBe(expectedHtml);
    });
  });

  describe('sendEmail', () => {
    it('should send email successfully', async () => {
      const to = 'recipient@example.com';
      const subject = 'Test Subject';
      const templateName = 'user-registration-otp';
      const data = { name: 'John Doe', otp: '123456' };
      const renderedHtml = '<html>Rendered email</html>';

      mockedEjs.renderFile.mockResolvedValue(renderedHtml);
      mockTransporter.sendMail.mockResolvedValue({ messageId: '123' });

      const result = await sendEmail(to, subject, templateName, data);

      expect(mockedEjs.renderFile).toHaveBeenCalledWith(
        expect.stringContaining(`${templateName}.ejs`),
        data,
      );
      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: `Hakika Support <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: renderedHtml,
      });
      expect(result).toBe(true);
    });

    it('should handle template rendering errors during send', async () => {
      const to = 'recipient@example.com';
      const subject = 'Test Subject';
      const templateName = 'user-registration-otp';
      const data = { name: 'John Doe' };
      const error = new Error('Template rendering failed');

      mockedEjs.renderFile.mockRejectedValue(error);

      await expect(sendEmail(to, subject, templateName, data)).rejects.toThrow(
        'Failed to send email',
      );
      expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('should handle SMTP sending errors', async () => {
      const to = 'recipient@example.com';
      const subject = 'Test Subject';
      const templateName = 'user-registration-otp';
      const data = { name: 'John Doe', otp: '123456' };
      const renderedHtml = '<html>Rendered email</html>';
      const smtpError = new Error('SMTP connection failed');

      mockedEjs.renderFile.mockResolvedValue(renderedHtml);
      mockTransporter.sendMail.mockRejectedValue(smtpError);

      await expect(sendEmail(to, subject, templateName, data)).rejects.toThrow(
        'Failed to send email',
      );
      expect(mockTransporter.sendMail).toHaveBeenCalled();
    });

    it('should send email with different data inputs', async () => {
      const to = 'another@example.com';
      const subject = 'Another Subject';
      const templateName = 'user-registration-otp';
      const data = { name: 'Jane Smith', otp: '654321' };
      const renderedHtml = '<html>Different rendered email</html>';

      mockedEjs.renderFile.mockResolvedValue(renderedHtml);
      mockTransporter.sendMail.mockResolvedValue({ messageId: '456' });

      const result = await sendEmail(to, subject, templateName, data);

      expect(mockTransporter.sendMail).toHaveBeenCalledWith({
        from: `Hakika Support <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: renderedHtml,
      });
      expect(result).toBe(true);
    });
  });
});
