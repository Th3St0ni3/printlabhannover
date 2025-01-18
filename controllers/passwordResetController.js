const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { findUserByEmail, updateResetToken, findUserByResetToken, updatePassword } = require('../models/userModel');

// E-Mail-Transporter (Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER, // Gmail-Adresse
    pass: process.env.EMAIL_PASS, // Gmail-Passwort (oder App-Passwort)
  },
});

exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: 'E-Mail-Adresse nicht gefunden' });
    }

    // Token generieren
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // Token 1 Stunde gültig

    await updateResetToken(email, resetToken, expiresAt);

    // E-Mail mit Reset-Link versenden
    const resetLink = `${req.protocol}://${req.get('host')}/auth/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Passwort zurücksetzen',
      html: `<p>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</p>
             <a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ message: 'Reset-Link wurde an Ihre E-Mail-Adresse gesendet' });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Senden der E-Mail' });
  }
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await findUserByResetToken(token);
    if (!user) {
      return res.status(400).json({ error: 'Ungültiger oder abgelaufener Reset-Token' });
    }

    // Neues Passwort speichern
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updatePassword(user.id, hashedPassword);

    res.json({ message: 'Passwort erfolgreich zurückgesetzt' });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Zurücksetzen des Passworts' });
  }
};
