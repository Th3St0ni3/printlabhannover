const express = require('express');
const { requestPasswordReset, resetPassword } = require('../controllers/passwordResetController');

const router = express.Router();

// POST: Passwort-Zurücksetzen anfordern
router.post('/request-reset', requestPasswordReset);

// POST: Neues Passwort speichern
router.post('/reset-password/:token', resetPassword);

module.exports = router;
