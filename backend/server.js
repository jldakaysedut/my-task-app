require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express(); // 1. Create the app FIRST

// 2. Middlewares (Must come after 'app' is created)
app.use(express.json());
app.use(cors());

// 3. Database Connection
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

// 4. Routes
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
            if (err) return res.status(500).json({ error: "Email already exists!" });
            res.json({ message: "Registration successful!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
});

// LOGIN (New Code Added Here)
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

// GET TASKS FOR A SPECIFIC USER
app.get('/tasks/:userId', (req, res) => {
    const { userId } = req.params;
    const sql = "SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC";
    
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json(results);
    });
});

// 5. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server started on http://localhost:${PORT}`);
});