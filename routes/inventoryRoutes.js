
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


router.post('/add', async (req, res) => {
  const { item_name, stock_quantity, category, supplier } = req.body;

  // Step 1: Log incoming data for debugging
  console.log("Received request to add item:", req.body);

  try {
    // Step 2: Check if the item with the same name and supplier already exists
    const existingItem = await pool.query(
      `SELECT * FROM inventory WHERE item_name ILIKE $1 AND supplier ILIKE $2`,
      [item_name, supplier]
    );
    console.log("Existing item check result:", existingItem.rows);

    if (existingItem.rows.length > 0) {
      // If the item exists, update the stock quantity
      const updatedItem = await pool.query(
        `UPDATE inventory
         SET stock_quantity = stock_quantity + $1
         WHERE item_id = $2
         RETURNING *`,
        [stock_quantity, existingItem.rows[0].item_id]
      );
      console.log("Updated item result:", updatedItem.rows[0]);
      return res.json({ message: 'Item quantity updated', item: updatedItem.rows[0] });
    }

    // Step 3: If the item does not exist, create a new item
    const newItem = await pool.query(
      `INSERT INTO inventory (item_name, stock_quantity, category, supplier) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [item_name, stock_quantity, category, supplier]
    );
    console.log("New item added:", newItem.rows[0]);
    res.json({ message: 'Item added successfully', item: newItem.rows[0] });

  } catch (err) {
    console.error("Error details:", err);
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


router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Step 1: Log the request and check the item_id
    console.log(`Received delete request for item with id: ${id}`);

    // Step 2: Check if the item exists in the inventory table
    const item = await pool.query(
      `SELECT * FROM inventory WHERE item_id = $1`,
      [id]
    );
    console.log("Item found in inventory:", item.rows);

    if (item.rows.length === 0) {
      return res.status(404).json({ error: "Item not found" });
    }

    const inventoryItem = item.rows[0];
    console.log("Item details:", inventoryItem);

    // Step 3: Check if there are student visits for this item
    const studentVisit = await pool.query(
      `SELECT * FROM student_visits WHERE item_id = $1`,
      [id]
    );
    console.log("Student visit records for item:", studentVisit.rows);

    // Step 4: Try nullifying the item_id in student_visits to preserve visit data
    try {
      if (studentVisit.rows.length > 0) {
        console.log(`Nullifying item_id references in student_visits for item id: ${id}`);
        await pool.query(
          `UPDATE student_visits SET item_id = NULL WHERE item_id = $1`,
          [id]
        );
        console.log("References nullified in student_visits.");
      }
    } catch (err) {
      console.log("Error nullifying item_id:", err.message);
      console.log("Setting fallback item_id instead.");

      // If nullifying fails, set a fallback item_id (e.g., 0 or an archived ID)
      await pool.query(
        `UPDATE student_visits SET item_id = 0 WHERE item_id = $1`,
        [id]
      );
      console.log("References updated to fallback item_id.");
    }

    // Step 5: Now, delete the item from the inventory table
    console.log(`Deleting item with id: ${id} from inventory.`);
    await pool.query(
      `DELETE FROM inventory WHERE item_id = $1`,
      [id]
    );

    res.json({ message: "Item removed from inventory successfully, visit data preserved." });

  } catch (err) {
    console.error("Error in delete operation:", err.message);
    res.status(500).json({ error: err.message });
  }
});




// ==================== EXPORT ROUTER ==================== //
module.exports = router;
