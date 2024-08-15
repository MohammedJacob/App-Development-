const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'database-1.ctqr5jyxzteg.eu-west-2.rds.amazonaws.com', 
  user: 'admin', 
  password: 'Mohammedshaheer17!', 
  database: 'patientInfo', 
});

// Export the connection pool
module.exports = pool.promise();
