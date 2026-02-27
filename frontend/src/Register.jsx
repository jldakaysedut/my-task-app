import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from './api'; // Correct path for your structure
import './App.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/register', { email, password });
            alert(res.data.message);
            navigate('/login'); // Move to login after successful registration
        } catch (err) {
            alert(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="auth-card">
            <h2>Create Account</h2>
            <form onSubmit={handleRegister}>
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
                <button type="submit">Register</button>
            </form>
            <p className="link-text">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default Register;