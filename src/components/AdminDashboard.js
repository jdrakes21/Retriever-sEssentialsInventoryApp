import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [popularItems, setPopularItems] = useState([]); // Start with an empty array
  const [peakHours, setPeakHours] = useState([]); // Start with an empty array
  const [peakDays, setPeakDays] = useState([]); // Start with an empty array
  const [loading, setLoading] = useState(true); // Loading state to show loading indicator

  // Function to update or add a popular item based on withdrawal count
  const updateItemPopularity = async (item_name, withdrawal_count) => {
    try {
      const response = await axios.post('http://localhost:5000/admin/update_popularity', {
        item_name: item_name,
        withdrawal_count: withdrawal_count
      });
      console.log(response.data.message);
      fetchPopularItems(); // Fetch the updated popular items
    } catch (err) {
      console.error('Error updating item popularity:', err.message);
    }
  };

  // Fetch most popular items from the backend
  const fetchPopularItems = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/admin/item_popularity?timestamp=${new Date().getTime()}`);
      setPopularItems(response.data);
    } catch (err) {
      console.error('Error fetching popular items:', err.message);
    }
  };

  useEffect(() => {
    // Fetch peak hours data from the backend
    const fetchPeakHours = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/peak-hours?timestamp=${new Date().getTime()}`);
        setPeakHours(response.data);
      } catch (err) {
        console.error('Error fetching peak hours data:', err.message);
      }
    };

    // Fetch peak days data from the backend
    const fetchPeakDays = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/admin/peak-days?timestamp=${new Date().getTime()}`);
        setPeakDays(response.data);
      } catch (err) {
        console.error('Error fetching peak days data:', err.message);
      }
    };

    // Wait for all fetch requests to complete
    Promise.all([fetchPopularItems(), fetchPeakHours(), fetchPeakDays()])
      .then(() => setLoading(false))
      .catch(err => {
        console.error('Error fetching data:', err.message);
        setLoading(false); // Even if an error occurs, set loading to false
      });

  }, []); // Empty dependency array means this will run once on page load

  if (loading) {
    // Show a loading message or spinner while the data is being fetched
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      {/* Most Popular Items */}
      <h3>Most Popular Items</h3>
      {popularItems.length === 0 ? (
        <p>No data available for most popular items.</p>
      ) : (
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
      )}

      {/* Peak Hours */}
      <h4>Peak Hours</h4>
      {peakHours.length === 0 ? (
        <p>No data available for peak hours.</p>
      ) : (
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
      )}

      {/* Peak Days */}
      <h4>Peak Days</h4>
      {peakDays.length === 0 ? (
        <p>No data available for peak days.</p>
      ) : (
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
      )}

      {/* Example of updating item popularity when a withdrawal occurs */}
      <div className="example-update">
        <h5>Update Item Popularity Example</h5>
        <button
          className="umbc-btn"
          onClick={() => updateItemPopularity('Bananas', 5)}
        >
          Add 5 Withdrawals for Bananas
        </button>
      </div>

      {/* Export Buttons */}
      <div className="download-buttons mt-4">
        <button
          className="umbc-btn"
          onClick={() => window.location.href = 'http://localhost:5000/export/export-inventory-csv'}
        >
          Download Inventory CSV
        </button>

        <button
          className="umbc-btn"
          onClick={() => window.location.href = 'http://localhost:5000/export/export-inventory-excel'}
        >
          Download Inventory Excel
        </button>

        <button
          className="umbc-btn"
          onClick={() => window.location.href = 'http://localhost:5000/export/export-withdrawals-csv'}
        >
          Download Withdrawals CSV
        </button>

        <button
          className="umbc-btn"
          onClick={() => window.location.href = 'http://localhost:5000/export/export-withdrawals-excel'}
        >
          Download Withdrawals Excel
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
