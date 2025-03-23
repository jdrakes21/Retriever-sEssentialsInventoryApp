import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InventoryList() {
  const [items, setItems] = useState([]);
  const [updatedQuantities, setUpdatedQuantities] = useState({});

  // Fetch inventory items on component mount
  useEffect(() => {
    fetchInventory();
  }, []);

  // GET Request to fetch all inventory items
  const fetchInventory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/inventory');
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching inventory:", err.message);
    }
  };

  // DELETE Request to delete an item
  const deleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/inventory/delete/${id}`);
      alert("Item Deleted!");
      fetchInventory(); // Refresh the list
    } catch (err) {
      console.error("Error deleting item:", err.message);
    }
  };

  // Handle input change for updated quantity
  const handleQuantityChange = (id, value) => {
    setUpdatedQuantities({
      ...updatedQuantities,
      [id]: value
    });
  };

  // PUT Request to update quantity
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
      fetchInventory(); // Refresh the list
    } catch (err) {
      console.error("Error updating quantity:", err.message);
    }
  };

  return (
    <div>
      <h2>Inventory Items</h2>
      <table border="1" cellPadding="10">
        <thead>
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
              <td>
                {item.stock_quantity}
                <br />
                <input
                  type="number"
                  placeholder="New Qty"
                  value={updatedQuantities[item.item_id] || ''}
                  onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
                />
                <button onClick={() => updateQuantity(item.item_id)}>Update</button>
              </td>
              <td>{item.category}</td>
              <td>{item.supplier}</td>
              <td>
                <button onClick={() => deleteItem(item.item_id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InventoryList;

