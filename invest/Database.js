import axios from 'axios';

// Base URL for your backend server
const BASE_URL = 'http://192.168.1.241:3000'; // Replace with your actual IP address and port

// Fetch the list of all tables from the backend
export const getTables = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tables`);
    return response.data; // Returns an array of tables
  } catch (error) {
    console.error('Error fetching tables:', error.message);
    throw error;
  }
};

// Fetch data from a specific table
export const getTableData = async (tableName) => {
  try {
    const response = await axios.get(`${BASE_URL}/data/${tableName}`);
    return response.data; // Returns an array of rows for the specified table
  } catch (error) {
    console.error(`Error fetching data from table ${tableName}:`, error.message);
    throw error;
  }
};

// Add a new User to the database
export const addUser = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/addUser`, {
      name: firstName,
      last_name: lastName,
      email: email, // Include email in the payload
      password: password, // Include password in the payload
      joined_date: new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
    });
    return response.data; // Returns the result of the insert operation
  } catch (error) {
    console.error('Error adding User:', error.message);
    throw error;
  }
};

// Test the module by running it directly with Node.js
if (require.main === module) {
  (async () => {
    try {
      console.log('Fetching tables...');
      const tables = await getTables();
      console.log('Tables:', tables);

      if (tables.length > 0) {
        const firstTable = tables[0].Tables_in_UserInfo;
        console.log(`Fetching data from table ${firstTable}...`);
        const data = await getTableData(firstTable);
        console.log(`Data from ${firstTable}:`, data);
      } else {
        console.log('No tables found.');
      }
    } catch (error) {
      console.error('Error during test:', error.message);
    }
  })();
}
