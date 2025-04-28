const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();


app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store"); // Disable caching
  next(); // Proceed to the next middleware or route handler
});

app.use((req, res, next) => {
  console.log(`Request received at ${req.method} ${req.url}`);
  next();
});

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
const studentVisitRoutes = require('./routes/studentVisitRoutes');
app.use('/student-visits', studentVisitRoutes);

// Import other route files
const exportRoutes = require('./routes/exportRoutes');  // Import the new export route

// Use the export routes
app.use('/export', exportRoutes);  // This will mount the export routes under /export path

// Import other route files
const exportWithdrawalRoutes = require('./routes/exportWithdrawalRoutes');  // Import the new export route

// Use the export routes
app.use('/export', exportWithdrawalRoutes);  // This will mount the export routes under /export path


// Use Routes
app.use('/inventory', inventoryRoutes);
app.use('/withdrawals', withdrawalRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


