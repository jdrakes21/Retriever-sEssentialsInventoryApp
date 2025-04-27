const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.send('Backend server is working!');
});

// Import Route Files
const inventoryRoutes = require('./routes/inventoryRoutes');
const withdrawalRoutes = require('./routes/withdrawalRoutes');
// Import routes for admin
const adminRoutes = require('./routes/adminRoutes'); 
app.use('/admin', adminRoutes);  // Register the routes under the '/admin' path

// Use Routes
app.use('/inventory', inventoryRoutes);
app.use('/withdrawals', withdrawalRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


