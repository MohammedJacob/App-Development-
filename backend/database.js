const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'database-1.ctqr5jyxzteg.eu-west-2.rds.amazonaws.com',
    user: 'admin',
    password: 'Mohammedshaheer17!', // Replace with your actual password
    database: 'patientInfo', // Correct database name
    port: 3306,
    connectTimeout: 990000
});

// Export a promise-based connection pool
module.exports = pool.promise();
