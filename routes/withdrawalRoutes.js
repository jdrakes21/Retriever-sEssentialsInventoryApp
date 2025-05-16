const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection

// GET all inventory items (with stock quantity > 0)
router.get('/', async (req, res) => {
    try {
      const allItems = await pool.query("SELECT * FROM inventory WHERE stock_quantity > 0 ORDER BY item_id ASC");
      res.json(allItems.rows);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ error: err.message });
    }
  });


// POST - Log a withdrawal and track item popularity
router.post('/', async (req, res) => {
  const { user_id, item_id, quantity } = req.body;

  try {
    const item = await pool.query('SELECT * FROM inventory WHERE item_id = $1', [item_id]);
    if (item.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }

    const availableQuantity = item.rows[0].stock_quantity;
    const price = item.rows[0].price;

    if (quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be greater than zero' });
    }

    if (availableQuantity < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    const withdrawal = await pool.query(
      `INSERT INTO withdrawals (user_id, item_id, quantity, withdrawal_date) 
       VALUES ($1, $2, $3, NOW()) RETURNING *`,
      [user_id, item_id, quantity]
    );

    await pool.query(
      `UPDATE inventory SET stock_quantity = stock_quantity - $1 WHERE item_id = $2`,
      [quantity, item_id]
    );

    const checkPopularity = await pool.query(
      `SELECT COUNT(*) FROM item_popularity WHERE item_id = $1`,
      [item_id]
    );

    if (checkPopularity.rows[0].count > 0) {
      await pool.query(
        `UPDATE item_popularity SET withdrawal_count = withdrawal_count + $1, last_updated = NOW() 
         WHERE item_id = $2`,
        [quantity, item_id]
      );
    } else {
      await pool.query(
        `INSERT INTO item_popularity (item_name, item_id, withdrawal_count) 
         VALUES ($1, $2, $3)`,
        [item.rows[0].item_name, item_id, quantity]
      );
    }

    res.json({ message: 'Withdrawal recorded', withdrawal: withdrawal.rows[0], total_cost: price * quantity });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;