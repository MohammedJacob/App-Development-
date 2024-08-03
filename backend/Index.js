const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = require('./database'); // Ensure this is correctly exporting your MySQL connection pool

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Function to format and log table schema
const formatTableSchema = (tableName, schema) => {
  console.log(`mysql> DESCRIBE ${tableName};`);
  console.log('+-------------+--------------+------+-----+---------+----------------+');
  console.log('| Field       | Type         | Null | Key | Default | Extra          |');
  console.log('+-------------+--------------+------+-----+---------+----------------+');
  schema.forEach(col => {
    console.log(`| ${col.Field.padEnd(11)} | ${col.Type.padEnd(12)} | ${col.Null.padEnd(4)} | ${col.Key.padEnd(3)} | ${col.Default === null ? 'NULL'.padEnd(7) : col.Default.toString().padEnd(7)} | ${col.Extra.padEnd(14)} |`);
  });
  console.log('+-------------+--------------+------+-----+---------+----------------+');
};

// Function to format and log table data
const formatTableData = (tableName, data) => {
  console.log(`mysql> SELECT * FROM ${tableName};`);
  if (data.length === 0) {
    console.log('Empty set (0.01 sec)');
    return;
  }
  const keys = Object.keys(data[0]);
  const header = keys.map(key => key.padEnd(15)).join('|');
  const rows = data.map(row => keys.map(key => (row[key] === null ? 'NULL' : row[key]).toString().padEnd(15)).join('|'));

  console.log('+----+' + header + '+');
  console.log(`| ${keys.map(key => key.padEnd(14)).join('|')} |`);
  console.log('+----+' + header + '+');
  rows.forEach(row => console.log(`| ${row} |`));
  console.log('+----+' + header + '+');
  console.log(`${data.length} row${data.length > 1 ? 's' : ''} in set (0.01 sec)`);
};

// Function to describe and fetch data from each table
const fetchAllTablesAndData = async () => {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = table[`Tables_in_patientInfo`];

      // Describe the table schema
      const [schema] = await pool.query('DESCRIBE ??', [tableName]);
      formatTableSchema(tableName, schema);

      // Fetch and log data from the table
      const [rows] = await pool.query('SELECT * FROM ??', [tableName]);
      formatTableData(tableName, rows);
    }
  } catch (err) {
    console.error('Error fetching tables or data:', err);
  }
};

// Connect to the database
pool.getConnection()
  .then(() => {
    console.log('Connected to the database.');
    fetchAllTablesAndData();
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
  });

// Endpoint to list all tables in the database
app.get('/tables', async (req, res) => {
  try {
    const [results] = await pool.query('SHOW TABLES');
    res.json(results);
  } catch (err) {
    console.error('Error fetching tables:', err);
    res.status(500).send(err.message);
  }
});

// Endpoint to get data from a specific table
app.get('/data/:tableName', async (req, res) => {
  const tableName = req.params.tableName;
  try {
    const [results] = await pool.query('SELECT * FROM ??', [tableName]);
    res.json(results);
  } catch (err) {
    console.error(`Error fetching data from table ${tableName}:`, err);
    res.status(500).send(err.message);
  }
});

// Endpoint to add a new patient
app.post('/addPatient', async (req, res) => {
  const { name, last_name, email_address, password, joined_date } = req.body;

  if (!name || !last_name || !email_address || !password || !joined_date) {
    return res.status(400).json({ error: 'Name, last name, email address, password, and joined date are required' });
  }

  try {
    const [existingPatients] = await pool.query('SELECT * FROM Patients WHERE email_address = ?', [email_address]);

    if (existingPatients.length > 0) {
      return res.status(400).json({ error: 'Email address already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO Patients (name, last_name, email_address, password, joined_date) VALUES (?, ?, ?, ?, ?)',
      [name, last_name, email_address, hashedPassword, joined_date]
    );

    res.status(201).json({ message: 'Patient added successfully' });
  } catch (err) {
    console.error('Error adding patient:', err);
    res.status(500).json({ error: 'Failed to add patient' });
  }
});

// Endpoint to register a new user
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO Users (username, hashed_password, joined_date) VALUES (?, ?, CURDATE())',
      [username, hashedPassword]
    );
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error registering user:', err);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Endpoint to authenticate a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [rows] = await pool.query('SELECT hashed_password FROM Users WHERE username = ?', [username]);
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, rows[0].hashed_password);
    if (isMatch) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// Endpoint to login with email
app.post('/loginWithEmail', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM Patients WHERE email_address = ?', [email]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Email address not recognized' });
    }

    res.json({ message: 'Email recognized', data: rows[0] });
  } catch (err) {
    console.error('Error logging in with email:', err);
    res.status(500).json({ error: 'Failed to log in with email' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
