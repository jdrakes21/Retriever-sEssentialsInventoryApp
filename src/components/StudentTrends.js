import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

function StudentTrends() {
  const [trendData, setTrendData] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchTrends = async () => {
    try {
      let url = 'http://localhost:5000/analytics/student-trends';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      const response = await axios.get(url);
      setTrendData(response.data);
    } catch (err) {
      console.error("Error fetching student trends:", err.message);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []); // Load initially

  const chartData = {
    labels: trendData.map(item => new Date(item.withdrawal_hour).toLocaleString()),
    datasets: [
      {
        label: 'Withdrawals per Hour',
        data: trendData.map(item => item.withdrawal_count),
        backgroundColor: '#f1c40f',
      }
    ]
  };

  return (
    <div className="container mt-5">
      <h3 className="text-dark mb-3">📅 Student Usage Trends</h3>

      {/* 🔥 Date Range Filters */}
      <div className="d-flex gap-3 mb-3">
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="d-flex align-items-end">
          <button className="umbc-btn" onClick={fetchTrends}>
            Filter
          </button>
        </div>
      </div>

      {/* Chart */}
      <Bar data={chartData} />
    </div>
  );
}

export default StudentTrends;
