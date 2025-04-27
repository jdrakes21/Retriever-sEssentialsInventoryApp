import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [popularItems, setPopularItems] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [peakDays, setPeakDays] = useState([]);

  useEffect(() => {
    // Fetch most popular items from the backend
    const fetchPopularItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/item_popularity');
        setPopularItems(response.data);
      } catch (err) {
        console.error('Error fetching popular items:', err.message);
      }
    };

    // Fetch peak hours data from the backend
    const fetchPeakHours = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/peak-hours');
        setPeakHours(response.data);
      } catch (err) {
        console.error('Error fetching peak hours data:', err.message);
      }
    };

    // Fetch peak days data from the backend
    const fetchPeakDays = async () => {
      try {
        const response = await axios.get('http://localhost:5000/admin/peak-days');
        setPeakDays(response.data);
      } catch (err) {
        console.error('Error fetching peak days data:', err.message);
      }
    };

    fetchPopularItems();
    fetchPeakHours();
    fetchPeakDays();
  }, []);

  return (
    <div className="admin-dashboard">
      <h3>Most Popular Items</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity Withdrawn</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {popularItems.map((item) => (
            <tr key={item.item_id}>
              <td>{item.item_name}</td>
              <td>{item.withdrawal_count}</td>
              <td>{new Date(item.last_updated).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Peak Hours */}
      <h4>Peak Hours</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Hour of Day</th>
            <th>Visit Count</th>
          </tr>
        </thead>
        <tbody>
          {peakHours.map((hourData, index) => (
            <tr key={index}>
              <td>{hourData.visit_hour}:00</td>
              <td>{hourData.visit_count}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Peak Days */}
      <h4>Peak Days</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Day of the Week</th>
            <th>Visit Count</th>
          </tr>
        </thead>
        <tbody>
          {peakDays.map((dayData, index) => (
            <tr key={index}>
              <td>{dayData.visit_day}</td>
              <td>{dayData.visit_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
