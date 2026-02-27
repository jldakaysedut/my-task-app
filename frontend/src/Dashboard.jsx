import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from './api';
import './App.css';

function Dashboard() {
    const [task, setTask] = useState('');
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    
    // Get user info from localStorage
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            fetchTasks();
        }
    }, []);

    const fetchTasks = async () => {
        try {
            // We'll create this GET route in the backend next!
            const res = await API.get(`/tasks/${user.id}`);
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks");
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        try {
            await API.post('/tasks', { user_id: user.id, task_text: task });
            setTask(''); // Clear input
            fetchTasks(); // Refresh list
        } catch (err) {
            alert("Error adding task");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
       // Inside Dashboard.jsx return:
<div className="auth-card" style={{ maxWidth: '600px' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '1.2rem', margin: 0 }}>System Online</h2>
        <button onClick={handleLogout} style={{ width: 'auto', padding: '5px 15px', borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)', boxShadow: '0 0 5px var(--neon-pink)' }}>Disconnect</button>
    </div>
    
    <p style={{ color: 'var(--neon-blue)', marginBottom: '20px' }}>User: {user?.email}</p>

    <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px' }}>
        <input 
            type="text" 
            placeholder="Initialize task..." 
            value={task}
            onChange={(e) => setTask(e.target.value)} 
            required 
        />
        <button type="submit" style={{ width: '100px', marginTop: '10px' }}>Sync</button>
    </form>

    <div style={{ marginTop: '30px' }}>
        {tasks.map((t) => (
            <li key={t.id}>
                <span>{t.task_text}</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--neon-purple)' }}>[ACTIVE]</span>
            </li>
        ))}
    </div>
</div>
    );
}

export default Dashboard;