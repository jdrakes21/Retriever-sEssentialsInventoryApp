const express = require('express');
require('dotenv').config();
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Root route test
app.get('/', (req, res) => {
  res.send('Main server is working!');
});

// Import and use inventory routes (but comment out for now)
try {
  const inventoryRoutes = require('./routes/inventoryRoutes');
  app.use('/inventory', inventoryRoutes);
} catch (err) {
  console.error('Inventory route issue:', err.message);
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Main Server running on port ${PORT}`));

