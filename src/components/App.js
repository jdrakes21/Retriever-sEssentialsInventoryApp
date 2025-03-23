import React from 'react';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';

function App() {
  return (
    <div className="App">
      <h1>Retriever’s Essentials Inventory</h1>
      <InventoryForm />
      <InventoryList />
    </div>
  );
}

export default App;

