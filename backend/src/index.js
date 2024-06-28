const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 5000;

// Créer un pool de connexions MySQL
const pool = mysql.createPool({
  host: 'db',
  user: 'user',
  password: 'password',
  database: 'mydatabase',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Vérifier si la connexion est établie
pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection lost.');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.');
    }
    console.error('Error connecting to database:', err);
  }
  if (connection) {
    connection.release(); // Relâcher la connexion après utilisation
    console.log('Connected to MySQL database.');
  }
  return;
});

// Endpoint pour récupérer les utilisateurs depuis la base de données
app.get('/users', (req, res) => {
  pool.query('SELECT * FROM users', (error, results) => {
    if (error) {
      console.error('Query error:', error);
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);
  });
});
// Endpoint pour la racine
app.get('/', (req, res) => {
  res.send('Welcome to the backend API');
});


// Démarrer le serveur Express
app.listen(port, () => {
  console.log(`Backend app listening at http://localhost:${port}`);
});
