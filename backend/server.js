require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();

// 1. UPDATED MIDDLEWARE FOR PRODUCTION
// This allows your specific Vercel URL to talk to this backend
app.use(cors({
    origin: "*", // This allows ANY site (like your phone or Vercel) to talk to the backend
    methods: ["GET", "POST"]
}));
app.use(express.json());

// 2. DATABASE CONNECTION
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false }
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed: " + err.message);
        return;
    }
    console.log("✅ Connected to Aiven Cloud Database!");
});

// 3. ROUTES
app.get('/', (req, res) => {
    res.send("Backend is running perfectly!");
});

// REGISTER
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (email, password) VALUES (?, ?)";
        db.query(sql, [email, hashedPassword], (err, result) => {
            if (err) return res.status(500).json({ error: "Database error or Email exists" });
            res.json({ message: "Registration successful!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// LOGIN
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(404).json({ error: "User not found" });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Incorrect password" });

        res.json({ 
            message: "Login successful!", 
            user: { id: user.id, email: user.email } 
        });
    });
});

// GET TASKS
app.get('/tasks/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC";
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// ADD TASK (Crucial for Dashboard to work!)
app.post('/tasks', (req, res) => {
    const { user_id, task_text } = req.body;
    const sql = "INSERT INTO tasks (user_id, task_text) VALUES (?, ?)";
    db.query(sql, [user_id, task_text], (err, result) => {
        if (err) return res.status(500).json({ error: "Failed to add task" });
        res.json({ message: "Task added successfully!" });
    });
});

// 4. START SERVER
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server started on port ${PORT}`);
});