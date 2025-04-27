
import React, { useState } from 'react';
import './App.css';
import InventoryForm from './components/InventoryForm';
import InventoryList from './components/InventoryList';
import InventoryReport from './components/InventoryReport';
import WithdrawalForm from './components/WithdrawalForm';
import AdminDashboard from './components/AdminDashboard'; // Admin Dashboard to show trends
import axios from 'axios';  // Import axios

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

      // Send the visit tracking data to the backend
      const userId = 'student18691'; // Get this dynamically from login
      const itemId = 36; // Replace this with the selected item id, or set as needed
      axios.post('http://localhost:5000/student-visits/track', { user_id: userId, item_id: itemId })
        .then((response) => {
          console.log('Visit logged:', response.data);
        })
        .catch((error) => {
          console.error('Error logging visit:', error);
        });
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
                <InventoryList role={role} /> {/* Pass role to InventoryList */}
                <InventoryReport />
                <AdminDashboard role={role} /> {/* Pass role to AdminDashboard */}
                <button className="umbc-btn" onClick={handleLogout}>Log Out</button>
              </>
            ) : (
              <>
                {/* Student Features */}
                <h3>Welcome Student! 🐾</h3>
                <WithdrawalForm role={role} /> {/* Pass role to WithdrawalForm */}
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
