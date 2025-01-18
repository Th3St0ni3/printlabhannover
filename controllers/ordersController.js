const db = require('../config/database');

exports.getOrders = async (req, res) => {
  try {
    const [orders] = await db.query('SELECT * FROM orders');
    res.render('orders', { orders });
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Abrufen der Bestellungen' });
  }
};

exports.createOrder = async (req, res) => {
  const { material, resolution, volume } = req.body;
  const stlFile = req.file.filename; // Hochgeladene Datei
  const price = calculatePrice(volume, resolution); // Dynamische Preisberechnung

  try {
    await db.query('INSERT INTO orders (material, volume, resolution, stlFile, price) VALUES (?, ?, ?, ?, ?)', 
      [material, volume, resolution, stlFile, price]);
    res.redirect('/orders'); // Weiterleitung nach erfolgreicher Bestellung
  } catch (error) {
    res.status(500).json({ error: 'Fehler beim Erstellen der Bestellung' });
  }
};

function calculatePrice(volume, resolution) {
  const resolutionFactor = resolution === 'high' ? 2 : resolution === 'medium' ? 1.5 : 1;
  return volume * resolutionFactor * 0.05;
}
