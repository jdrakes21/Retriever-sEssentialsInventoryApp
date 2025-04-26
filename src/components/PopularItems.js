import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PopularItems() {
  const [popularItems, setPopularItems] = useState([]);

  useEffect(() => {
    fetchPopularItems();
  }, []);

  const fetchPopularItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/analytics/popular-items');
      setPopularItems(response.data);
    } catch (err) {
      console.error("Error fetching popular items:", err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-dark border-bottom pb-2 mb-3">🔥 Popular Items</h3>
      {popularItems.length > 0 ? (
        <table className="table table-hover table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Item Name</th>
              <th>Withdrawal Count</th>
            </tr>
          </thead>
          <tbody>
            {popularItems.map((item, index) => (
              <tr key={index}>
                <td>{item.item_name}</td>
                <td>{item.withdrawal_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No popular items yet. Withdrawals will appear here!</p>
      )}
    </div>
  );
}

export default PopularItems;
