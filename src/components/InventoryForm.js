import React, { useState } from 'react';
import axios from 'axios';

const InventoryForm = React.memo(({ addItemToList }) => {
  const [formData, setFormData] = useState({
    item_name: '',
    stock_quantity: '',
    category: '',
    supplier: '',
    price: '' // Price field added
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isNaN(formData.stock_quantity) || formData.stock_quantity <= 0) {
      alert("Please enter a valid stock quantity.");
      return;
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/inventory/add', formData);
      alert('Item Added Successfully!');
      addItemToList(response.data);
      setFormData({
        item_name: '',
        stock_quantity: '',
        category: '',
        supplier: '',
        price: '' // Reset price field
      });
    } catch (err) {
      console.error('Error while adding item:', err);
      alert('Error adding item');
    }
  };

  const isFormValid = formData.item_name && formData.stock_quantity && formData.category && formData.supplier && formData.price;

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
      <input
        name="price"
        className="form-control mb-2"
        placeholder="Price"
        type="number"
        onChange={handleChange}
        value={formData.price}
        required
      />
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
        required
      />
      <button className="umbc-btn" type="submit" disabled={!isFormValid}>Add Item</button>
    </form>
  );
});

export default InventoryForm;
