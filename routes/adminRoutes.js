const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection

// GET - Retrieve most popular items based on withdrawal count
router.get('/item_popularity', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT item_name, withdrawal_count, last_updated 
       FROM item_popularity 
       WHERE withdrawal_count > 0
       ORDER BY withdrawal_count DESC
       LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// POST - Add or update item popularity based on withdrawals
router.post('/update_popularity', async (req, res) => {
  const { item_name, withdrawal_count } = req.body;

  try {
    // Check if the item already exists in item_popularity (case-insensitive)
    const existingItem = await pool.query(
      `SELECT * FROM item_popularity WHERE item_name ILIKE $1`,
      [item_name]
    );

    if (existingItem.rows.length > 0) {
      // If the item exists, update the withdrawal count by adding the new withdrawal_count
      const updatedItem = await pool.query(
        `UPDATE item_popularity
         SET withdrawal_count = withdrawal_count + $1, last_updated = NOW()
         WHERE item_id = $2
         RETURNING *`,
        [withdrawal_count, existingItem.rows[0].item_id]
      );
      res.json({ message: 'Item popularity updated successfully', item: updatedItem.rows[0] });
    } else {
      // If the item doesn't exist, insert a new record into item_popularity
      const newItem = await pool.query(
        `INSERT INTO item_popularity (item_name, withdrawal_count, last_updated)
         VALUES ($1, $2, NOW()) RETURNING *`,
        [item_name, withdrawal_count]
      );
      res.json({ message: 'New item added to popularity list', item: newItem.rows[0] });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});



router.get('/inventory-turnover', async (req, res) => {
  try {
    // Example query for COGS (you will need to adjust to your actual database setup)
    const cogs = await pool.query('SELECT SUM(cogs) FROM sales'); // Adjust to pull from your database

    // Query to get the average inventory during the period
    const avgInventory = await pool.query('SELECT AVG(stock_quantity) FROM inventory');

    // Assuming we have COGS and average inventory values
    const turnoverRate = cogs.rows[0].sum / avgInventory.rows[0].avg;

    res.json({ turnoverRate });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET - Retrieve student visits based on visits (from student_visits table)
router.get('/student-visits', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        v.user_id, 
        i.item_name, 
        COUNT(v.item_id) AS visit_count, 
        TO_CHAR(v.visit_timestamp, 'YYYY-MM-DD') AS visit_date
       FROM student_visits v
       JOIN inventory i ON v.item_id = i.item_id
       GROUP BY v.user_id, i.item_name, visit_date
       ORDER BY visit_count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET - Retrieve peak hours based on visit timestamps (from student_visits table)
router.get('/peak-hours', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        EXTRACT(HOUR FROM visit_timestamp) AS visit_hour, 
        COUNT(*) AS visit_count
       FROM student_visits
       GROUP BY visit_hour
       ORDER BY visit_count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET - Retrieve peak days based on visit timestamps (from student_visits table)
router.get('/peak-days', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        TO_CHAR(visit_timestamp, 'Day') AS visit_day, 
        COUNT(*) AS visit_count
       FROM student_visits
       GROUP BY visit_day
       ORDER BY visit_count DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// GET - Retrieve transaction history for withdrawals
router.get('/transaction-history', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        w.user_id, 
        i.item_name, 
        w.quantity, 
        i.price, 
        (w.quantity * i.price) AS total_price, 
        w.withdrawal_timestamp
       FROM withdrawals w
       JOIN inventory i ON w.item_id = i.item_id
       ORDER BY w.withdrawal_timestamp DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transaction history:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

