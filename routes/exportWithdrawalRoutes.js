const express = require('express');
const router = express.Router();
const pool = require('../db'); // Database connection
const { Parser } = require('json2csv');
const exceljs = require('exceljs');

// Route for Withdrawal Report Export to CSV
router.get('/export-withdrawals-csv', async (req, res) => {
  try {
    const withdrawalData = await pool.query('SELECT * FROM withdrawals');
    
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
    const withdrawalData = await pool.query('SELECT * FROM withdrawals');

    const workbook = new exceljs.Workbook();
    const worksheet = workbook.addWorksheet('Withdrawals');

    worksheet.columns = [
      { header: 'User ID', key: 'user_id' },
      { header: 'Item ID', key: 'item_id' },
      { header: 'Quantity', key: 'quantity' },
      { header: 'Withdrawal Date', key: 'withdrawal_date' },
    ];

    withdrawalData.rows.forEach((withdrawal) => {
      worksheet.addRow(withdrawal);
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=withdrawal-report.xlsx');

    return workbook.xlsx.write(res).then(() => {
      res.end();
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
