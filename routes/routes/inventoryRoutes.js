const express = require('express');
const router = express.Router();
const pool = require('../db');

// Add Inventory Item
router.post('/add', async (req, res) => {
  const { item_name, stock_quantity, category, supplier } = req.body;
  try {
    const newItem = await pool.query(
      "INSERT INTO Inventory (item_name, stock_quantity, category, supplier) VALUES ($1, $2, $3, $4) RETURNING *",
      [item_name, stock_quantity, category, supplier]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Update Inventory Item Quantity
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { stock_quantity } = req.body;
    try {
      const updateItem = await pool.query(
        "UPDATE Inventory SET stock_quantity = $1 WHERE item_id = $2 RETURNING *",
        [stock_quantity, id]
      );
      res.json(updateItem.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Delete Inventory Item
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await pool.query("DELETE FROM Inventory WHERE item_id = $1", [id]);
      res.json({ message: "Item deleted successfully." });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
