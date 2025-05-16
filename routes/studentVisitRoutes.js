const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection

// POST - Track a student visit (when they log in or take an item)
router.post('/track', async (req, res) => {
  const { user_id, item_id } = req.body;
  const visit_timestamp = new Date(); // Capture the current timestamp when the student logs in or visits an item

  try {
    // Step 1: Check if the item exists in the inventory table
    console.log('Checking if item exists in inventory...');
    const itemCheck = await pool.query('SELECT * FROM inventory WHERE item_id = $1', [item_id]);
    
    // Log the result of the item check
    console.log('Item check result:', itemCheck.rows);

    if (itemCheck.rows.length === 0) {
      console.log(`Item with ID ${item_id} does not exist in inventory.`);
      return res.status(400).json({ error: 'Invalid item_id. Item does not exist in inventory.' });
    }

    // Step 2: Insert a new visit record into the student_visits table
    console.log('Inserting visit into student_visits table...');
    const visit = await pool.query(
      `INSERT INTO student_visits (user_id, item_id, visit_timestamp) 
       VALUES ($1, $2, $3) RETURNING *`,
      [user_id, item_id, visit_timestamp]
    );

    // Log the inserted visit data
    console.log('Visit logged:', visit.rows[0]);

    res.json({ message: 'Visit logged successfully', visit: visit.rows[0] });
  } catch (err) {
    // Log any error that occurs
    console.error('Error logging visit:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

