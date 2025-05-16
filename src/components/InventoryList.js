import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const LOW_STOCK_THRESHOLD = 10;

function InventoryList({ role }) {
  const [items, setItems] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});
  const [successMessage, setSuccessMessage] = useState('');  // Add successMessage state

  // Fetch inventory data from the backend
  const fetchInventory = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory');
      console.log("API Response:", response.data);
      const availableItems = role === 'student'
        ? response.data.filter(item => item.stock_quantity > 0)
        : response.data;
      setItems(availableItems);
    } catch (err) {
      console.error("Error fetching inventory:", err.message);
    }
  }, [role]);

  useEffect(() => {
    fetchInventory(); // Fetch inventory immediately on load
    const interval = setInterval(fetchInventory, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [fetchInventory]);

  const handleWithdrawal = async (itemId, quantity) => {
    if (role !== 'student') {
      setSuccessMessage('Only students can make withdrawals!');  // Set message for invalid role
      return;
    }

    const item = items.find(i => i.item_id === itemId);  // Ensure itemId matches
    const totalPrice = item.price * quantity;  // Calculate the total price

    console.log("Sending withdrawal request for item:", itemId, "quantity:", quantity, "totalPrice:", totalPrice);

    try {
      const userId = 'student18691';  // This should be dynamically set after login

      const response = await axios.post('http://localhost:5000/transactions', {
        user_id: userId,
        item_id: itemId,
        quantity: quantity,
        total_price: totalPrice,  // Ensure total_price is passed to the backend
      });

      console.log("Response from backend:", response.data);

      // After withdrawal, refetch the inventory to update quantities
      fetchInventory();

      // Set success message with the transaction total amount
      setSuccessMessage(`Transaction successful! Total: $${response.data.total_amount}`);
    } catch (err) {
      console.error("Error processing withdrawal:", err.message);
      setSuccessMessage('Error processing withdrawal.');  // Show error message
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/inventory/delete/${id}`);
      alert(response.data.message);
      fetchInventory();
    } catch (err) {
      console.error("Error deleting item:", err.message);
      alert("Error deleting item. Make sure the item is fully withdrawn.");
    }
  };

  const handleQuantityChange = (id, value) => {
    setUpdatedQuantities({
      ...updatedQuantities,
      [id]: value
    });
  };

  const updateQuantity = async (id) => {
    try {
      if (!updatedQuantities[id]) {
        alert("Please enter a new quantity first!");
        return;
      }

      await axios.put(`http://localhost:5000/inventory/update/${id}`, {
        stock_quantity: updatedQuantities[id]
      });
      alert("Quantity Updated!");
      fetchInventory();
    } catch (err) {
      console.error("Error updating quantity:", err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-dark border-bottom pb-2 mb-4">📦 Inventory Items</h2>

      {/* Display success or error message */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      {/* Main Inventory Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Price</th> {/* Moved Price column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.item_id}>
              <td>{item.item_name}</td>
              <td className={item.stock_quantity < LOW_STOCK_THRESHOLD ? 'low-stock' : ''}>
                {item.stock_quantity}
                {item.stock_quantity < LOW_STOCK_THRESHOLD && <span> ⚠️ Low Stock</span>}
                <br />
                <input
                  type="number"
                  className="form-control form-control-sm mt-1"
                  placeholder="Enter Quantity"
                  value={updatedQuantities[item.item_id] || ''}
                  onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
                />
                {role === 'admin' && (
                  <button className="umbc-btn mt-1" onClick={() => updateQuantity(item.item_id)}>
                    Update
                  </button>
                )}
                {role === 'student' && (
                  <button className="umbc-btn mt-1" onClick={() => handleWithdrawal(item.item_id, updatedQuantities[item.item_id])}>
                    Withdraw
                  </button>
                )}
              </td>
              <td>{item.category}</td>
              <td>{item.supplier}</td>
              <td>{item.price !== null && item.price !== undefined
                ? `$${parseFloat(item.price).toFixed(2)}`
                : 'Price not available'}</td>
              <td>
                <button className="umbc-btn" onClick={() => deleteItem(item.item_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Low Stock Items */}
      <h3 className="text-dark mt-5">⚠️ Low Stock Items</h3>
      <table className="table table-bordered">
        <thead className="table-warning text-dark">
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Price</th> {/* Moved Price column */}
          </tr>
        </thead>
        <tbody>
          {items
            .filter(item => item.stock_quantity < LOW_STOCK_THRESHOLD)
            .map(item => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td>{item.stock_quantity}</td>
                <td>{item.category}</td>
                <td>{item.supplier}</td>
                <td>{item.price !== null && item.price !== undefined
                  ? `$${parseFloat(item.price).toFixed(2)}`
                  : 'Price not available'}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;