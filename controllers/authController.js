const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { registerUser, findUserByUsername } = require('../models/userModel');

exports.register = async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await registerUser(username, hashedPassword);
    res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
  } catch (error) {
    res.status(500).json({ error: 'Fehler bei der Registrierung' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Ungültiges Passwort' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.json({ message: 'Login erfolgreich' });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Login' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout erfolgreich' });
};
