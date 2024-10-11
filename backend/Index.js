const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const pool = require('./database'); // Import your MySQL connection pool
const WebSocket = require('ws'); // WebSocket library
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

const wss = new WebSocket.Server({ noServer: true });

// Store WebSocket connections
const clients = new Set();

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

const broadcastPortfolioUpdate = (portfolioData) => {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type: 'portfolioUpdate', data: portfolioData }));
    }
  });
};

// Handle WebSocket connections
wss.on('connection', (ws) => {
  clients.add(ws);

  ws.on('close', () => {
    clients.delete(ws);
  });
});


// Function to describe and fetch data from each table
const fetchAllTablesAndData = async () => {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    for (const table of tables) {
      const tableName = Object.values(table)[0]; // Extract table name from object

      // Describe the table schema
      const [schema] = await pool.query('DESCRIBE ??', [tableName]);
      formatTableSchema(tableName, schema); // Call to log the table schema

      // Fetch and log data from the table
      const [rows] = await pool.query('SELECT * FROM ??', [tableName]);
      formatTableData(tableName, rows); // Call to log the table data
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

// Endpoint to fetch card data
app.get('/api/cards', async (req, res) => {
  try {
    const [results] = await pool.query('SELECT id, title, price, targetPrice, image, description, Files FROM Cards');
    if (results.length === 0) {
      return res.status(404).json({ error: 'No card data found' });
    }
    res.json(results);
  } catch (err) {
    console.error('Error fetching cards:', err);
    res.status(500).json({ error: 'Failed to fetch card data', details: err.message });
  }
});


// Endpoint to change a user's password
app.put('/changePassword', async (req, res) => {
  const { user_id, currentPassword, newPassword } = req.body;

  // Validate the input
  if (!user_id || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'User ID, current password, and new password are required.' });
  }

  try {
    // Fetch the user from the database
    const [user] = await pool.query('SELECT password FROM User WHERE id = ?', [user_id]);

    // Check if the user exists
    if (user.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const hashedCurrentPassword = user[0].password;

    // Compare the current password with the one in the database
    const isMatch = await bcrypt.compare(currentPassword, hashedCurrentPassword);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    // Verify that the new password is different from the current one
    const isSameAsCurrent = await bcrypt.compare(newPassword, hashedCurrentPassword);
    if (isSameAsCurrent) {
      return res.status(400).json({ error: 'New password cannot be the same as the current password.' });
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await pool.query('UPDATE User SET password = ? WHERE id = ?', [hashedNewPassword, user_id]);

    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Failed to change password', details: error.message });
  }
});





// Endpoint to add a new User
app.post('/addUser', async (req, res) => {
  const { name, last_name, email_address, password, joined_date } = req.body;

  if (!name || !last_name || !email_address || !password || !joined_date) {
    return res.status(400).json({ error: 'Name, last name, email address, password, and joined date are required' });
  }

  try {
    const [existingUser] = await pool.query('SELECT * FROM User WHERE email_address = ?', [email_address]);

    if (existingUser.length > 0) {
      return res.status(400).json({ error: 'Email address already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO User (name, last_name, email_address, password, joined_date) VALUES (?, ?, ?, ?, ?)',
      [name, last_name, email_address, hashedPassword, joined_date]
    );

    res.status(201).json({ message: 'User added successfully' });
  } catch (err) {
    console.error('Error adding User:', err);
    res.status(500).json({ error: 'Failed to add User', details: err.message });
  }
});

// Endpoint to update a user's profile
// Endpoint to update a user's profile
app.put('/updateProfile', upload.single('profile_image'), async (req, res) => {
  const { id, username } = req.body;
  
  // Check if the user ID is present
  if (!id) {
    return res.status(400).json({ error: 'ID is required' });
  }

  try {
    // Initialize query parameters
    let query = 'UPDATE User SET ';
    let params = [];

    // If a username is provided, add it to the query
    if (username) {
      query += 'username = ?, ';
      params.push(username);
    }

    // Handle profile image if uploaded
    if (req.file) {
      query += '|profile_image = ?, ';
      params.push(req.file.path); // Path to the uploaded image
    }

    // Remove trailing comma and space from the query
    query = query.slice(0, -2);
    query += ' WHERE id = ?';
    params.push(id);

    // Check if there's actually something to update
    if (params.length === 1) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    // Execute the query
    const result = await pool.query(query, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
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
      'INSERT INTO User (username, hashed_password, joined_date) VALUES (?, ?, CURDATE())',
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
    const [rows] = await pool.query('SELECT hashed_password FROM User WHERE username = ?', [username]);
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
    const [rows] = await pool.query('SELECT * FROM User WHERE email_address = ?', [cleanedEmail]);

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

// Example route to get portfolio for a user
app.get('/api/portfolio/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [portfolio] = await pool.query(
      `SELECT Investments.*, Cards.title, Cards.price, Cards.targetPrice, Cards.image, 
       Cards.return_value, Cards.investment, Cards.yield 
       FROM Investments 
       JOIN Cards ON Investments.card_id = Cards.id 
       WHERE Investments.user_id = ?`, 
      [userId]
    );

    res.json(portfolio);

    // Broadcast the portfolio update to WebSocket clients
    broadcastPortfolioUpdate(portfolio);
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Error fetching portfolio' });
  }
});

// Endpoint to add an investment
app.post('/api/investments', async (req, res) => {
  const { user_id, card_id, amount_invested, investment_date } = req.body;

  if (!user_id || !card_id || !amount_invested || !investment_date) {
    return res.status(400).json({ error: 'User ID, card ID, amount invested, and investment date are required.' });
  }

  try {
    // Get the card title to be stored as invested_stock
    const [card] = await pool.query('SELECT title FROM Cards WHERE id = ?', [card_id]);

    if (card.length === 0) {
      return res.status(404).json({ error: 'Card not found' });
    }

    const invested_stock = card[0].title;

    // Insert the investment, including invested_stock
    await pool.query('INSERT INTO Investments (user_id, card_id, amount_invested, investment_date, invested_stock) VALUES (?, ?, ?, ?, ?)', 
      [user_id, card_id, amount_invested, investment_date, invested_stock]);

    res.status(201).json({ message: 'Investment added successfully' });
  } catch (error) {
    console.error('Error saving investment:', error);
    res.status(500).json({ error: 'Failed to save investment', details: error.message });
  }
});

// Upgrade HTTP server for WebSocket
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});