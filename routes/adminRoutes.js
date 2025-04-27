const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection

// GET - Retrieve most popular items based on withdrawal count
router.get('/item_popularity', async (req, res) => {
  try {
    // Query to get the most popular items, ordered by withdrawal count
    const result = await pool.query(
      `SELECT item_name, withdrawal_count, last_updated
       FROM item_popularity
       ORDER BY withdrawal_count DESC
       LIMIT 10`
    );
    res.json(result.rows);  // Return the rows to the frontend
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });  // Return error if the query fails
  }
});

module.exports = router;
