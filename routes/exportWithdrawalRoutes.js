const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection
const { Parser } = require('json2csv');
const exceljs = require('exceljs');

router.get('/export-withdrawals-csv', async (req, res) => {
  try {
    // Modify the query to JOIN withdrawals with inventory on item_id
    const withdrawalData = await pool.query(`
      SELECT 
        w.user_id, 
        w.item_id, 
        i.item_name, 
        w.quantity, 
        w.withdrawal_date
      FROM withdrawals w
      JOIN inventory i ON w.item_id = i.item_id
    `);

    const parser = new Parser();
    const csv = parser.parse(withdrawalData.rows);

    res.header('Content-Type', 'text/csv');
    res.attachment('withdrawal-report.csv');
    return res.send(csv);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});


// Route for Withdrawal Report Export to Excel
router.get('/export-withdrawals-excel', async (req, res) => {
  try {
    // Modify the query to JOIN withdrawals with inventory on item_id
    const withdrawalData = await pool.query(`
      SELECT 
        w.user_id, 
        w.item_id, 
        i.item_name, 
        w.quantity, 
        w.withdrawal_date
      FROM withdrawals w
      JOIN inventory i ON w.item_id = i.item_id
    `);

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Withdrawals');

    // Define columns, including item_name
    worksheet.columns = [
      { header: 'User ID', key: 'user_id' },
      { header: 'Item ID', key: 'item_id' },
      { header: 'Item Name', key: 'item_name' }, // Adding item_name column
      { header: 'Quantity', key: 'quantity' },
      { header: 'Withdrawal Date', key: 'withdrawal_date' },
    ];

    // Add each row to the Excel sheet
    withdrawalData.rows.forEach((withdrawal) => {
      worksheet.addRow(withdrawal);
    });

    // Set headers for downloading the Excel file
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=withdrawal-report.xlsx');

    // Write the workbook to the response
    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

