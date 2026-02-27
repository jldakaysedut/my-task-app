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
        <div className="auth-card" style={{ maxWidth: '500px' }}>
            <h2>Welcome, {user?.email}</h2>
            <button onClick={handleLogout} style={{ backgroundColor: '#dc3545', marginBottom: '20px' }}>Logout</button>
            
            <form onSubmit={handleAddTask} style={{ display: 'flex', gap: '10px' }}>
                <input 
                    type="text" 
                    placeholder="Enter a new task..." 
                    value={task}
                    onChange={(e) => setTask(e.target.value)} 
                    required 
                />
                <button type="submit" style={{ width: '80px' }}>Add</button>
            </form>

            <ul style={{ textAlign: 'left', marginTop: '20px', listStyle: 'none', padding: 0 }}>
                {tasks.map((t) => (
                    <li key={t.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                        {t.task_text}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Dashboard;