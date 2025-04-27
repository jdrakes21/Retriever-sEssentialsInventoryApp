import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';  // Correct the path to point to the correct directory


function WithdrawalForm() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch available items from the correct backend URL
    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/inventory'); // Correct port (5000)
        setItems(response.data);
      } catch (err) {
        console.error('Error fetching inventory:', err.message);
        setError('Failed to load inventory items');
      }
    };
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedItem || !quantity) {
      setError('Please select an item and specify a quantity.');
      return;
    }
  
    const userId = 'student18691'; // Assuming this is dynamically assigned after login
  
    try {
      // Send the selected item_id instead of item_name
      await axios.post('http://localhost:5000/withdrawals', {
        user_id: userId,
        item_id: selectedItem, // Send item_id here
        quantity: parseInt(quantity),
      });
      alert('Withdrawal successful!');
      setSelectedItem('');
      setQuantity('');
      setError('');
    } catch (err) {
      setError('Error processing withdrawal');
      console.error(err.message);
    }
  };
  
  

  return (
    <div className="withdrawal-form-container">
      <h3>Make a Withdrawal</h3>
      <form onSubmit={handleSubmit} className="withdrawal-form">
        <div className="form-group">
          <label htmlFor="item-name">Item Name</label>
          <select
  id="item-name"
  className="form-control"
  value={selectedItem}
  onChange={(e) => setSelectedItem(e.target.value)} 
  required
>
  <option value="">-- Select Item --</option>
  {items.map((item) => (
    <option key={item.item_id} value={item.item_id}> {/* Change to item_id */}
      {item.item_name}
    </option>
  ))}
</select>
        </div>

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            className="form-control"
            placeholder="Enter Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button className="umbc-btn" type="submit">
          Submit
        </button>
      </form>

      <div className="available-items">
        <h5>Available Items</h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity Available</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td>{item.stock_quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WithdrawalForm;