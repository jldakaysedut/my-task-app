import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Dashboard from './Dashboard'; // <--- Add this
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* <--- Add this */}
      </Routes>
    </Router>
  );
}

export default App;