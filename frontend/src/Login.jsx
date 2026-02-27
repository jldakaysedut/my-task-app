import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from './api'; // Correct path for your structure
import './App.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/login', { email, password });
            
            // Save user info to browser memory (localStorage)
            localStorage.setItem('user', JSON.stringify(res.data.user));
            
            alert("Login successful!");
            navigate('/dashboard'); // We will create this next!
        } catch (err) {
            alert(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="auth-card">
            <h2>Welcome Back</h2>
            <form onSubmit={handleLogin}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            <p className="link-text">
                Need an account? <Link to="/register">Register</Link>
            </p>

            // ... inside the return of Login.jsx
<div className="auth-card">
    <h2>Welcome Back</h2>
    {/* ... your existing form and link-text ... */}

    <p className="footer-text">y-chan x b-kun 2026</p>
</div>
        </div>
    );
}

export default Login;