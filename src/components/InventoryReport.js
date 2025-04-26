import React, { useState } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const LOW_STOCK_THRESHOLD = 10;

function InventoryReport() {
  const [items, setItems] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory');
      const filtered = response.data.filter(item => {
        const addedDate = new Date(item.added_on);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (!start || addedDate >= start) && (!end || addedDate <= end);
      });

      setItems(filtered);
      setShowReport(true);
    } catch (err) {
      console.error("Error fetching inventory:", err.message);
    }
  };

  const exportPDF = () => {
    const reportElement = document.getElementById('report-section');
    html2canvas(reportElement).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      pdf.addImage(imgData, 'PNG', 10, 10, 190, 0);
      pdf.save(`inventory-report-${new Date().toISOString().slice(0, 10)}.pdf`);
    });
  };

  const totalItems = items.length;
  const lowStockCount = items.filter(item => item.stock_quantity < LOW_STOCK_THRESHOLD).length;

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const categorySummary = filteredItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.stock_quantity;
    return acc;
  }, {});

  const csvData = items.map(item => ({
    Item_Name: item.item_name,
    Quantity: item.stock_quantity,
    Category: item.category,
    Supplier: item.supplier,
    Added_On: item.added_on,
  }));

  const categoryChartData = Object.entries(categorySummary).map(([category, total]) => ({
    category,
    quantity: total
  }));

  const categoryOptions = ['All', ...new Set(items.map(item => item.category))];

  return (
    <div className="mt-5 p-3 bg-light shadow-sm rounded" id="report-section">
      <h3 className="text-dark mb-3">📊 Inventory Report</h3>

      <div className="d-flex flex-wrap gap-3 mb-3">
        <div>
          <label>Start Date: </label>
          <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>End Date: </label>
          <input type="date" className="form-control" value={endDate} onChange={e => setEndDate(e.target.value)} />
        </div>
        <div>
          <label>Filter Category: </label>
          <select className="form-control" value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <button className="umbc-btn me-2" onClick={fetchInventory}>
          Generate Report
        </button>
        {showReport && (
          <>
            <CSVLink
              data={csvData}
              filename={`inventory-report-${new Date().toISOString().slice(0, 10)}.csv`}
              className="umbc-btn me-2"
            >
              Download CSV
            </CSVLink>
            <button className="umbc-btn" onClick={exportPDF}>
              Export as PDF
            </button>
          </>
        )}
      </div>

      {showReport && (
        <>
          <p><strong>Total Unique Items:</strong> {totalItems}</p>
          <p><strong>Low Stock Items:</strong> {lowStockCount}</p>

          <h5 className="mt-4">Stock by Category</h5>
          <ul className="list-group">
            {Object.entries(categorySummary).map(([category, total]) => (
              <li key={category} className="list-group-item d-flex justify-content-between">
                <span>{category}</span>
                <span><strong>{total}</strong> items</span>
              </li>
            ))}
          </ul>

          <h5 className="mt-5">📈 Category Chart</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#ffcc00" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}
    </div>
  );
}

export default InventoryReport;
