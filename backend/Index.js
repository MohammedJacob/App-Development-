const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = require('./database'); // Import your MySQL connection pool

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
      const tableName = table[`Tables_in_patientInfo`]; // Ensure this matches your actual table name format

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
    res.status(500).json({ error: 'Failed to fetch tables', details: err.message });
  }
});

// Endpoint to get data from a specific table
app.get('/data/:tableName', async (req, res) => {
  const tableName = req.params.tableName;
  try {
    const [results] = await pool.query('SELECT * FROM ??', [tableName]);
    if (results.length === 0) {
      return res.status(404).json({ error: `No data found in table ${tableName}` });
    }
    res.json(results);
  } catch (err) {
    console.error(`Error fetching data from table ${tableName}:`, err);
    if (err.code === 'ER_NO_SUCH_TABLE') {
      res.status(404).json({ error: `Table ${tableName} not found`, details: err.message });
    } else {
      res.status(500).json({ error: 'Failed to fetch data', details: err.message });
    }
  }
});

// Endpoint to fetch card data
app.get('/api/cards', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT * FROM Cards');
    if (results.length === 0) {
      return res.status(404).json({ error: 'No card data found' });
    }
    res.json(results);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: 'Failed to fetch card data', details: err.message });
  }
});

// Endpoint to update a card's price
app.put('/api/cards/:id', async (req, res) => {
  const cardId = req.params.id;
  const { price } = req.body;

  if (price === undefined || isNaN(price) || parseFloat(price) <= 0) {
    return res.status(400).json({ error: 'Valid price is required' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE Cards SET price = ? WHERE id = ?',
      [price, cardId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    res.json({ message: 'Card price updated successfully' });
  } catch (err) {
    console.error('Error updating card price:', err);
    res.status(500).json({ error: 'Failed to update card price', details: err.message });
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
    res.status(500).json({ error: 'Failed to add patient', details: err.message });
  }
});

// Endpoint to update a user's profile
app.put('/updateProfile', async (req, res) => {
  const { id, username, profileImage } = req.body;

  if (!id || !username) {
    return res.status(400).json({ error: 'ID and username are required' });
  }

  try {
    const updateQuery = 'UPDATE Patients SET username = ?, profile_image = ? WHERE id = ?';
    const values = [username, profileImage || null, id];

    const [result] = await pool.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
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
    res.status(500).json({ error: 'Failed to register user', details: err.message });
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
    res.status(500).json({ error: 'Failed to authenticate user', details: err.message });
  }
});

// Endpoint to authenticate a user with email
app.post('/loginWithEmail', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    const cleanedEmail = email.trim().toLowerCase();
    const [rows] = await pool.query('SELECT * FROM Patients WHERE email_address = ?', [cleanedEmail]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const { password, ...userData } = user;
      res.json({ message: 'Login successful', userData });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ error: 'Failed to authenticate user', details: err.message });
  }
});

app.post('/api/Patients', async (req, res) => {
  const { email, card_id, amount_invested } = req.body;

  if (!email || !card_id || amount_invested === undefined || isNaN(amount_invested) || parseFloat(amount_invested) <= 0) {
    return res.status(400).json({ error: 'Valid email, card_id, and amount_invested are required' });
  }

  try {
    // Fetch the patient by email
    const [user] = await pool.query('SELECT id, invested_stock, invested_amount FROM Patients WHERE email_address = ?', [email]);

    if (user.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const userId = user[0].id;
    const existingInvestedStock = user[0].invested_stock || ''; // Default to an empty string if null
    const existingInvestedAmount = parseFloat(user[0].invested_amount) || 0; // Default to 0 if null

    // Fetch the card title based on card_id
    const [card] = await pool.query('SELECT title FROM Cards WHERE id = ?', [card_id]);
    if (card.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const cardTitle = card[0].title;

    // Update invested_stock and invested_amount
    const updatedInvestedStock = existingInvestedStock 
      ? `${existingInvestedStock}, ${cardTitle}` 
      : cardTitle; // If invested_stock exists, append the new card

    const updatedInvestedAmount = existingInvestedAmount + parseFloat(amount_invested);

    // Update the patient's record in the database
    await pool.query(
      'UPDATE Patients SET invested_stock = ?, invested_amount = ? WHERE id = ?',
      [updatedInvestedStock, updatedInvestedAmount, userId]
    );

    res.status(201).json({ message: 'Investment added successfully' });
  } catch (err) {
    console.error('Error processing investment:', err);
    res.status(500).json({ error: 'Failed to process investment', details: err.message });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
