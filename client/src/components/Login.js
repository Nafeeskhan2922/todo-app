// client/src/components/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.css'; // Import CSS for styling

const Login = ({ setLoggedInUser }) => {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate(); // Use navigate hook

    const { username, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password
            });
            localStorage.setItem('token', res.data.token);
            setLoggedInUser(username);
            setMessage('Logged in successfully');

            // Navigate to the home page (or any other protected route)
            navigate('/');
        } catch (err) {
            console.error(err.response.data);
            setMessage('Failed to login - wrong credentials');
        }
    };

    return (
        <>
           <h2 className='text-center mb-3'>Todo App</h2>
        <div className="auth-form">
            <h3 className='text-center'>Login</h3>
            <form onSubmit={onSubmit}>
                <input type="text" placeholder="Username" name="username" value={username} onChange={onChange} required />
                <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} required />
                <button type="submit">Login</button>
            </form>
            <p className="message">{message}</p>
        </div>
        </>

    );
};

export default Login;
