const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection

// POST - Log a withdrawal and track item popularity
router.post('/', async (req, res) => {
  const { user_id, item_id, quantity } = req.body;

  try {
    console.log('Request received:', { user_id, item_id, quantity });

    // Look up the item by ID
    const item = await pool.query('SELECT * FROM inventory WHERE item_id = $1', [item_id]);
    console.log('Item fetched from inventory:', item.rows);

    if (item.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const availableQuantity = item.rows[0].stock_quantity;
    console.log('Available quantity:', availableQuantity);

    if (availableQuantity < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    // Record the withdrawal
    const withdrawal = await pool.query(
      `INSERT INTO withdrawals (user_id, item_id, quantity, withdrawal_date) 
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [user_id, item_id, quantity]
    );
    console.log('Withdrawal recorded:', withdrawal.rows[0]);

    // Update inventory
    await pool.query(
      `UPDATE inventory SET stock_quantity = stock_quantity - $1 WHERE item_id = $2`,
      [quantity, item_id]
    );
    console.log('Inventory updated successfully.');

    // Track item popularity (update withdrawal count)
    const popularityUpdate = await pool.query(
      `INSERT INTO item_popularity (item_name, item_id, withdrawal_count)
       VALUES ($1, $2, $3)
       ON CONFLICT (item_id) 
       DO UPDATE SET withdrawal_count = item_popularity.withdrawal_count + $3, last_updated = NOW()`,
      [item.rows[0].item_name, item_id, quantity]
    );
    console.log('Item popularity updated:', popularityUpdate.rows);

    res.json({ message: 'Withdrawal recorded', withdrawal: withdrawal.rows[0] });
  } catch (err) {
    console.error('Error processing withdrawal:', err.message);
    res.status(500).json({ error: 'Error processing withdrawal: ' + err.message });
  }
});

module.exports = router;
