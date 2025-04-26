import React, { useState } from 'react';
import axios from 'axios';

function InventoryForm() {
  const [formData, setFormData] = useState({
    item_name: '',
    stock_quantity: '',
    category: '',
    supplier: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/inventory/add', formData);
      alert('Item Added Successfully!');
      setFormData({
        item_name: '',
        stock_quantity: '',
        category: '',
        supplier: ''
      });
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        name="item_name"
        className="form-control mb-2"
        placeholder="Item Name"
        onChange={handleChange}
        value={formData.item_name}
        required
      />

      <input
        name="stock_quantity"
        className="form-control mb-2"
        placeholder="Quantity"
        type="number"
        onChange={handleChange}
        value={formData.stock_quantity}
        required
      />

      {/* ✅ Dropdown for Category */}
      <select
        name="category"
        className="form-control mb-2"
        value={formData.category}
        onChange={handleChange}
        required
      >
        <option value="">-- Select Category --</option>
        <option value="Essentials">Essentials</option>
        <option value="Snacks">Snacks</option>
        <option value="Beverages">Beverages</option>
        <option value="Toiletries">Toiletries</option>
        <option value="Frozen">Frozen</option>
      </select>

      <input
        name="supplier"
        className="form-control mb-2"
        placeholder="Supplier"
        onChange={handleChange}
        value={formData.supplier}
      />

      <button className="umbc-btn" type="submit">Add Item</button>
    </form>
  );
}

export default InventoryForm;
