import { sendMail } from '../utils/mailer.js';
import { renderTemplate } from '../utils/templateEngine.js';

export const mailController = {
  // POST /api/mail/alert-login
  sendAlertLogin: async (req, res) => {
    try {
      console.log('[SMTP] Body reçu brut:', req.body);
      const { to, username } = req.body;

      if (!to || !username) {
        return res.status(400).json({ message: 'Missing "to" or "username"' });
      }

      const html = renderTemplate('alertLogin', { username });

      await sendMail({
        to,
        subject: 'Alerte de connexion à votre compte',
        html,
      });

      res.status(200).json({ message: 'Email sent successfully.' });
    } catch (err) {
      console.error('Erreur lors de l’envoi de l’email :', err);
      res.status(500).json({ message: 'Error sending email.', error: err.message });
    }
  },

  // POST /api/mail/reset-password
  sendResetPassword: async (req, res) => {
    try {
      const { to, username, resetLink } = req.body;

      if (!to || !username || !resetLink) {
        return res.status(400).json({ message: 'Missing "to", "username" or "resetLink"' });
      }

      const html = renderTemplate('resetPassword', { username, resetLink });

      await sendMail({
        to,
        subject: 'Réinitialisation de mot de passe',
        html,
      });

      res.status(200).json({ message: 'Email sent successfully.' });
    } catch (err) {
      console.error('Erreur lors de l’envoi de l’email :', err);
      res.status(500).json({ message: 'Error sending email.', error: err.message });
    }
  },

  // POST /api/mail/alert-signin
  sendAlertSignIn: async (req, res) => {
    try {
      console.log('[SMTP] Body reçu:', req.body); // <-- log pour debug
      const { to, username } = req.body;

      if (!to || !username) {
        return res.status(400).json({ message: 'Missing "to" or "username"' });
      }

      const html = renderTemplate('alertSignIn', { username });

      await sendMail({
        to,
        subject: 'Création de compte',
        html,
      });

      res.status(200).json({ message: 'Email sent successfully.' });
    } catch (err) {
      console.error('[SMTP] Erreur SMTP:', err);
      res.status(500).json({ message: 'Error sending email.', error: err.message });
    }
  },
};