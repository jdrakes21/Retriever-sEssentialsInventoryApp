import React, { useState } from 'react';
import './App.css';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import InventoryReport from './components/InventoryReport';
import WithdrawalForm from './components/WithdrawalForm';
import AdminDashboard from './components/AdminDashboard'; 

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');  // Track if Admin or Student
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    // Dummy login logic
    if (credentials.username === 'admin' && credentials.password === 'adminpass') {
      setIsLoggedIn(true);
      setRole('admin');
    } else if (credentials.username === 'student' && credentials.password === 'studentpass') {
      setIsLoggedIn(true);
      setRole('student');
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('');
    setCredentials({ username: '', password: '' });
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <div className="App">
      <header className="header d-flex align-items-center justify-content-center gap-3">
        <img src="/umbc-logo.png" alt="UMBC Logo" style={{ height: '50px' }} />
        <span>Retriever’s Essentials Inventory 🐾</span>
      </header>

      <div className="container mt-4">
        {/* ✅ Dummy Login Section */}
        {!isLoggedIn ? (
          <form onSubmit={handleLogin} className="login-form mt-4">
            <h5>🔒 Login</h5>
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              className="form-control my-2"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              className="form-control my-2"
              required
            />
            <button className="umbc-btn">Login</button>
          </form>
        ) : (
          <>
            {role === 'admin' ? (
              <>
                {/* Admin Features */}
                <InventoryForm />
                <InventoryList />
                <InventoryReport />
                <AdminDashboard /> {/* Admin Dashboard to show popular items */}
                <button className="umbc-btn" onClick={handleLogout}>Log Out</button>
              </>
            ) : (
              <>
                {/* Student Features */}
                <h3>Welcome Student! 🐾</h3>
                <WithdrawalForm /> {/* Render WithdrawalForm for students */}
                <button className="umbc-btn" onClick={handleLogout}>Log Out</button>
              </>
            )}
          </>
        )}
      </div>

      <footer className="footer">
        © {new Date().getFullYear()} UMBC · Built by Team 2
      </footer>
    </div>
  );
}

export default App;

