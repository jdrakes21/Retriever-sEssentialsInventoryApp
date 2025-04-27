
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

// GET all available inventory items for Student (stock > 0)
router.get('/available', async (req, res) => {
  try {
    const availableItems = await pool.query(
      "SELECT * FROM inventory WHERE stock_quantity > 0 ORDER BY item_id ASC"
    );
    res.json(availableItems.rows);  // Only items with stock > 0 for student
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});


// POST - Add or update an inventory item
router.post('/add', async (req, res) => {
  const { item_name, stock_quantity, category, supplier } = req.body;

  try {
    // Check if the item with the same name and supplier already exists (case-insensitive)
    const existingItem = await pool.query(
      `SELECT * FROM inventory WHERE item_name ILIKE $1 AND supplier ILIKE $2`,
      [item_name, supplier]
    );

    if (existingItem.rows.length > 0) {
      // If the item exists with the same supplier, update the stock quantity
      const updatedItem = await pool.query(
        `UPDATE inventory
         SET stock_quantity = stock_quantity + $1
         WHERE item_id = $2
         RETURNING *`,
        [stock_quantity, existingItem.rows[0].item_id]
      );
      return res.json({ message: 'Item quantity updated', item: updatedItem.rows[0] });
    }

    // If the item does not exist, create a new item
    const newItem = await pool.query(
      `INSERT INTO inventory (item_name, stock_quantity, category, supplier) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [item_name, stock_quantity, category, supplier]
    );
    res.json({ message: 'Item added successfully', item: newItem.rows[0] });
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
