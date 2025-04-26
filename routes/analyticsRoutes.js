const express = require('express');
const router = express.Router();
const pool = require('../db'); // your database connection

//  Get Most Popular Withdrawn Items
router.get('/popular-items', async (req, res) => {
  try {
    const popularItems = await pool.query(`
      SELECT inventory.item_name, COUNT(withdrawals.withdrawal_id) AS withdrawal_count
      FROM withdrawals
      JOIN inventory ON withdrawals.item_id = inventory.item_id
      GROUP BY inventory.item_name
      ORDER BY withdrawal_count DESC
      LIMIT 10;
    `);

    res.json(popularItems.rows); // send the popular items back to frontend
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

router.get('/student-trends', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = `
      SELECT
        DATE_TRUNC('hour', transaction_date) AS withdrawal_hour,
        COUNT(*) AS withdrawal_count
      FROM withdrawals
    `;

    const conditions = [];
    const values = [];

    if (startDate) {
      conditions.push(`transaction_date >= $${values.length + 1}`);
      values.push(startDate);
    }
    if (endDate) {
      conditions.push(`transaction_date <= $${values.length + 1}`);
      values.push(endDate);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' GROUP BY withdrawal_hour ORDER BY withdrawal_hour;';

    const trends = await pool.query(query, values);

    res.json(trends.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;