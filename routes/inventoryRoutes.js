
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection

// ==================== ROUTES ==================== //

// GET all inventory items
router.get('/', async (req, res) => {
  try {
    const allItems = await pool.query("SELECT * FROM inventory ORDER BY item_id ASC");
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});


// POST - Add a new inventory item
router.post('/add', async (req, res) => {
  const { item_name, stock_quantity, category, supplier } = req.body;

  try {
    const newItem = await pool.query(
      `INSERT INTO inventory (item_name, stock_quantity, category, supplier) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [item_name, stock_quantity, category, supplier]
    );
    res.json(newItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// PUT - Update inventory quantity
router.put('/update/:id', async (req, res) => {
  const { id } = req.params;
  const { stock_quantity } = req.body;

  try {
    const updateItem = await pool.query(
      `UPDATE inventory SET stock_quantity = $1 WHERE item_id = $2 RETURNING *`,
      [stock_quantity, id]
    );
    if (updateItem.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(updateItem.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Delete inventory item
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteItem = await pool.query(
      `DELETE FROM inventory WHERE item_id = $1 RETURNING *`,
      [id]
    );
    if (deleteItem.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json({ message: "Item deleted successfully!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});


// ==================== EXPORT ROUTER ==================== //
module.exports = router;


/*
const express = require('express');
const router = express.Router();

// Simple test route
router.get('/', (req, res) => {
  res.send('Inventory route basic test working!');
});

module.exports = router;
*/
