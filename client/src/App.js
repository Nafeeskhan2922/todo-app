// client/src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Register from './components/Register';
import Login from './components/Login';
import Todo from './components/Todo';

const App = () => {
    const [loggedInUser, setLoggedInUser] = useState(null);

    // Check if the token is valid and set the user state
    useEffect(() => {
        const checkToken = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const res = await axios.get('http://localhost:5000/api/auth/user', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setLoggedInUser(res.data.username);
                } catch (err) {
                    console.error('Token verification failed:', err);
                    localStorage.removeItem('token');
                    setLoggedInUser(null);
                }
            }
        };

        checkToken();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setLoggedInUser(null);
    };

    return (
        <Router>
            <div className="App">
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">Home</Link>
                        <div className="collapse navbar-collapse">
                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                {!loggedInUser ? (
                                    <>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/login">Login</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/register">Register</Link>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                       <li className="nav-item">
                                            <span className="navbar">Welcome, {loggedInUser}</span>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to="/todo">Todo</Link>
                                        </li>
                                        <li className="nav-item">
                                            <button className="btn btn-link nav-link" onClick={handleLogout}>Logout</button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
                <Routes>
                    <Route path="/" element={loggedInUser ? <Navigate to="/todo" /> : <Navigate to="/login" />} />
                    <Route path="/login" element={!loggedInUser ? <Login setLoggedInUser={setLoggedInUser} /> : <Navigate to="/todo" />} />
                    <Route path="/register" element={!loggedInUser ? <Register /> : <Navigate to="/todo" />} />
                    <Route path="/todo" element={loggedInUser ? <Todo /> : <Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
