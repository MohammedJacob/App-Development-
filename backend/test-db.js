// Import the connection pool from database.js
const pool = require('./database');

// Function to test the database connection
async function testConnection() {
    try {
        // Execute a simple query to test the connection
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Connection test successful. Result:', rows[0].result);
    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
}

// Run the test function
testConnection();
