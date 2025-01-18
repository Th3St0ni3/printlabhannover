const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const ordersRoutes = require('./routes/orders');
// const reviewsRoutes = require('./routes/reviews');
const passwordResetRoutes = require('./routes/passwordReset');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine (EJS für HTML-Seiten)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routen
app.use('/orders', ordersRoutes);
//app.use('/reviews', reviewsRoutes);
app.use('/auth', passwordResetRoutes);

// Start des Servers
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
