import React from 'react';
import './App.css';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';

function App() {
  return (
    <div className="App">
      {/* ✅ UMBC-Themed Header */}
      <header className="header d-flex align-items-center justify-content-center gap-3">
        <img
          src="/umbc-logo.png"
          alt="UMBC Logo"
          style={{ height: '50px' }}
        />
        <span>Retriever’s Essentials Inventory 🐾</span>
      </header>

      {/* ✅ Main Content */}
      <div className="container mt-4">
        <InventoryForm />
        <InventoryList />
      </div>

      {/* ✅ Footer */}
      <footer className="footer">
        © {new Date().getFullYear()} UMBC · Built by Jervon Drakes & Team
      </footer>
    </div>
  );
}

export default App;


