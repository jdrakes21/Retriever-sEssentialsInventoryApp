const express = require('express');
const router = express.Router();
const pool = require('../db'); // Your database connection
const { Parser } = require('json2csv');
const exceljs = require('exceljs');

// Route for CSV Export
router.get('/export-inventory-csv', async (req, res) => {
  //console.log("Export Inventory CSV route hit");
    try {
    const inventoryData = await pool.query('SELECT * FROM inventory');
    
    const parser = new Parser();
    const csv = parser.parse(inventoryData.rows);
    
    res.header('Content-Type', 'text/csv');
    res.attachment('inventory-report.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

// Route for Excel Export
router.get('/export-inventory-excel', async (req, res) => {
  try {
    const inventoryData = await pool.query('SELECT * FROM inventory');

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Inventory');

    worksheet.columns = [
      { header: 'Item Name', key: 'item_name' },
      { header: 'Stock Quantity', key: 'stock_quantity' },
      { header: 'Category', key: 'category' },
      { header: 'Supplier', key: 'supplier' },
    ];

    inventoryData.rows.forEach((item) => {
      worksheet.addRow(item);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=inventory-report.xlsx');

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
