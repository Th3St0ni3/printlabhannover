const db = require('../config/database');

// Benutzer registrieren
exports.registerUser = async (username, hashedPassword) => {
  return db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
};

// Benutzer anhand des Benutzernamens finden
exports.findUserByUsername = async (username) => {
  const [user] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
  return user[0];
};

exports.updateResetToken = async (email, resetToken, expiresAt) => {
    return db.query(
      'UPDATE users SET resetToken = ?, resetTokenExpires = ? WHERE email = ?',
      [resetToken, expiresAt, email]
    );
  };
  
  exports.findUserByResetToken = async (resetToken) => {
    const [user] = await db.query(
      'SELECT * FROM users WHERE resetToken = ? AND resetTokenExpires > NOW()',
      [resetToken]
    );
    return user[0];
  };
  
  exports.updatePassword = async (userId, hashedPassword) => {
    return db.query(
      'UPDATE users SET password = ?, resetToken = NULL, resetTokenExpires = NULL WHERE id = ?',
      [hashedPassword, userId]
    );
  };
  