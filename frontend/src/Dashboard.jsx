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
       <div className="auth-card">
    <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span style={{ color: 'var(--neon-purple)', fontWeight: 'bold', fontSize: '0.8rem' }}>SYS: ONLINE</span>
        <button onClick={handleLogout} style={{ width: 'auto', padding: '6px 12px', fontSize: '0.7rem', borderColor: 'var(--neon-pink)', color: 'var(--neon-pink)', boxShadow: 'none' }}>LOGOUT</button>
    </div>

    <h2>DASHBOARD</h2>
    <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '20px' }}>{user?.email}</p>

    <form onSubmit={handleAddTask}>
        <input 
            type="text" 
            placeholder="Initialize new task..." 
            value={task}
            onChange={(e) => setTask(e.target.value)} 
            required 
        />
        <button type="submit">Sync Task</button>
    </form>

    <div className="task-container">
        {tasks.map((t) => (
            <div className="task-item" key={t.id}>
                <span>{t.task_text}</span>
                <span className="status-tag">Active</span>
            </div>
        ))}
    </div>
</div>
    );
}

export default Dashboard;