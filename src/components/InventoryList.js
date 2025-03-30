import React, { useEffect, useState } from 'react';
import axios from 'axios';

const LOW_STOCK_THRESHOLD = 10;

function InventoryList() {
  const [items, setItems] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory');
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching inventory:", err.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/inventory/delete/${id}`);
      alert("Item Deleted!");
      fetchInventory();
    } catch (err) {
      console.error("Error deleting item:", err.message);
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
                  placeholder="New Qty"
                  value={updatedQuantities[item.item_id] || ''}
                  onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
                />
                <button className="umbc-btn mt-1" onClick={() => updateQuantity(item.item_id)}>
                  Update
                </button>
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
