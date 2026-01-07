import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import ejs from 'ejs';
import path from 'path';

dotenv.config();

// Config Validation
const requiredEnvVars = [
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_USER',
  'SMTP_PASSWORD',
];
const missingVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}`,
  );
}

const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    service: process.env.SMTP_SERVICE,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

// Export verification so main.ts can await it if needed
export const verifySmtp = async () => {
  try {
    await getTransporter().verify();
    console.log('SMTP server connection verified');
  } catch (error) {
    console.error('SMTP verification failed:', error);
  }
};

export const renderEmailTemplate = async (
  templateName: string,
  data: Record<string, unknown>,
) => {
  const templatePath = path.resolve(
    process.cwd(),
    'src',
    'assets',
    'templates',
    `${templateName}.ejs`,
  );

  return ejs.renderFile(templatePath, data);
};

export const sendEmail = async (
  to: string,
  subject: string,
  templateName: string,
  data: Record<string, unknown>,
) => {
  try {
    const html = await renderEmailTemplate(templateName, data);

    await getTransporter().sendMail({
      from: `Hakika Support <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
    throw new Error('Failed to send email');
  }
};
