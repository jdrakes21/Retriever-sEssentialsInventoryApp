import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminDashboard() {
  const [popularItems, setPopularItems] = useState([]);

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
    fetchPopularItems();
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
    </div>
  );
}

export default AdminDashboard;
