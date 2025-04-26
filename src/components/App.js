import React from 'react';
import './App.css';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import InventoryReport from './components/InventoryReport';
import PopularItems from './components/PopularItems'; //  Import it

function App() {
  return (
    <div className="App">
      <header className="header d-flex align-items-center justify-content-center gap-3">
        <img
          src="/umbc-logo.png"
          alt="UMBC Logo"
          style={{ height: '50px' }}
        />
        <span>Retriever’s Essentials Inventory 🐾</span>
      </header>

      <div className="container mt-4">
        <InventoryForm />
        <InventoryList />
        <InventoryReport />
        <PopularItems /> {/*  Show Popular Items Table */}
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} UMBC · Built by Team 2
      </footer>
    </div>
  );
}

export default App;



