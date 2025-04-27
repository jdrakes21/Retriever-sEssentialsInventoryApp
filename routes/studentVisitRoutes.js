const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection

// POST - Track a student visit (when they log in or take an item)
router.post('/track', async (req, res) => {
  const { user_id, item_id } = req.body;
  const visit_timestamp = new Date(); // Capture the current timestamp when the student logs in or visits an item
  
  try {
    // Insert a new visit record into the student_visits table
    const visit = await pool.query(
      `INSERT INTO student_visits (user_id, item_id, visit_timestamp) 
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, item_id, visit_timestamp]
    );

    // Successfully logged the visit
    res.json({ message: 'Visit logged successfully', visit: visit.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
