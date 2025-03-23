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
    <form onSubmit={handleSubmit}>
      <input name="item_name" placeholder="Item Name" onChange={handleChange} value={formData.item_name} required />
      <input name="stock_quantity" placeholder="Quantity" type="number" onChange={handleChange} value={formData.stock_quantity} required />
      <input name="category" placeholder="Category" onChange={handleChange} value={formData.category} />
      <input name="supplier" placeholder="Supplier" onChange={handleChange} value={formData.supplier} />
      <button type="submit">Add Item</button>
    </form>
  );
}

export default InventoryForm;
