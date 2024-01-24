

  const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Set up MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'shah1',
  password: 'shah12345',
  database: 'project',
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL as id ' + connection.threadId);
});

// Middleware for parsing JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));


// CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// API endpoint for signup
// API endpoint for signup
app.post('/fetch', (req, res) => {
  console.log('Hereeeee');
  const { passport, username, acomoditior, phone, visa, age, gender, nationality } = req.body;

  // Check if user already exists in the database
  const checkUserQuery = 'SELECT * FROM pilgrim WHERE passport_number = ?';
  connection.query(checkUserQuery, [passport], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking user:', checkErr);
      res.status(500).send(`Internal Server Error: ${checkErr.message}`);
    } else {
      if (checkResult.length > 0) {
        // User already exists, send drop.html content
        console.log('User signed up Failed, sending drop.html');
        console.log('drop1');
        res.json({ nextStep: 'drop.html' });

      } else {
        // User does not exist, insert new user into the database
        const insertUserQuery = 'INSERT INTO pilgrim (passport_number, name, acomodation, visa_status, contact_information, age, gender, nationality) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [passport, username, acomoditior, visa, phone, age, gender, nationality];
        connection.query(insertUserQuery, values, (insertErr, insertResult) => {
          if (insertErr) {
            console.error('Error during signup:', insertErr);
            res.status(500).send(`Internal Server Error: ${insertErr.message}`);
          } else {
            // User signed up successfully, send next.html content
            console.log('User signed up successfully, sending next.html');
            res.json({ nextStep: 'next.html' });

          }
        });
      }
    }
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});




app.post('/fetch1', (req, res) => {
  const { passport, username } = req.body;

  // Check if user already exists in the database based on name and passport
  const checkUserQuery = 'SELECT * FROM pilgrim WHERE passport_number = ? AND name = ?';
  connection.query(checkUserQuery, [passport, username], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking user:', checkErr);
      res.status(500).send(`Internal Server Error: ${checkErr.message}`);
    } else {
      console.log('Redirecting...',checkResult);
      let nextPage = ''
      if (checkResult.length > 0) {
        console.log('User with matching name and passport found, sending next1.html');
        //nextPage = 'next12.html';
        res.json({ nextStep: 'next1.html' });
      } else {
          console.log('No user with matching name and passport, sending drop1.html');
          //nextPage = 'drop1.html';
          res.json({ nextStep: 'drop1.html'});
      }
      //res.json({ nextStep: nextPage });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
