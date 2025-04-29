import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LOW_STOCK_THRESHOLD = 10;

function InventoryList({ role }) {
  const [items, setItems] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});

  // Fetch inventory data from the backend
  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory');
      // If the role is student, filter out items with zero stock quantity
      const availableItems = role === 'student' 
        ? response.data.filter(item => item.stock_quantity > 0) // Only show items with stock > 0 for students
        : response.data;  // Admins will see all items
      setItems(availableItems);
    } catch (err) {
      console.error("Error fetching inventory:", err.message);
    }
  };

  // Set up polling to fetch inventory every 5 seconds
  useEffect(() => {
    fetchInventory(); // Fetch inventory immediately on load
    const interval = setInterval(fetchInventory, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [role]); // Only re-run the fetch when role changes

  // Handle Withdrawal for students
  const handleWithdrawal = async (itemId, quantity) => {
    if (role !== 'student') {
      alert("Only students can make withdrawals!");
      return;
    }

    try {
      const userId = 'student18691'; // This should be dynamically set after login

      // Make the withdrawal API request
      await axios.post('http://localhost:5000/withdrawals', {
        user_id: userId,
        item_id: itemId,
        quantity: quantity,
      });

      // After withdrawal, refetch the inventory to update quantities
      fetchInventory();
      alert("Withdrawal successful!");
    } catch (err) {
      console.error("Error processing withdrawal:", err.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/inventory/delete/${id}`);
      alert(response.data.message);  // Alert with the returned message
      fetchInventory();  // Re-fetch the inventory to update the list
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
      fetchInventory(); // Refetch inventory after update
    } catch (err) {
      console.error("Error updating quantity:", err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-dark border-bottom pb-2 mb-4">📦 Inventory Items</h2>

      {/* Main Inventory Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Supplier</th>
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
                {/* Show Update button for admins */}
                {role === 'admin' && (
                  <button className="umbc-btn mt-1" onClick={() => updateQuantity(item.item_id)}>
                    Update
                  </button>
                )}
                {/* Show Withdraw button for students */}
                {role === 'student' && (
                  <button className="umbc-btn mt-1" onClick={() => handleWithdrawal(item.item_id, updatedQuantities[item.item_id])}>
                    Withdraw
                  </button>
                )}
              </td>
              <td>{item.category}</td>
              <td>{item.supplier}</td>
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
          </tr>
        </thead>
        <tbody>
          {items
            .filter(item => item.stock_quantity < LOW_STOCK_THRESHOLD)
            .map(item => (
              <tr key={item.item_id}>
                <td>{item.item_name}</td>
                <td className="low-stock">{item.stock_quantity}</td>
                <td>{item.category}</td>
                <td>{item.supplier}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;

