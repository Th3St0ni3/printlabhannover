const express = require('express');
const multer = require('multer');
const { authenticateToken } = require('../middleware/authMiddleware');
const { createOrder, getOrders } = require('../controllers/ordersController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', authenticateToken, getOrders); // Geschützte Route
router.post('/submit', authenticateToken, upload.single('stlFile'), createOrder);

module.exports = router;
