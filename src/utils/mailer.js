import nodemailer from 'nodemailer';
import { env } from "../config/env.js";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const transporter = nodemailer.createTransport({
  host: env.smtpHost,
  port: parseInt(env.smtpPort),
  secure: env.smtpPort === 465,
  auth: {
    user: env.smtpUser,
    pass: env.smtpPass,
  },
});

export const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"NETFLIM" <noreply@mailtrap.io>`,
    to,
    subject,
    html,
  });
};
