require('dotenv').config();
const mysql = require('mysql2/promise');

async function setup() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        ssl: { rejectUnauthorized: false }
    });

    console.log("Connected! Creating tables...");

    await connection.execute(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        )
    `);

    await connection.execute(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            task_text VARCHAR(255) NOT NULL,
            is_completed BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    console.log("✅ Success! Tables created.");
    process.exit();
}

setup().catch(console.error);