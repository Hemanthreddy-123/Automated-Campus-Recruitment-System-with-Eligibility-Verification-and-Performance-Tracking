const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '2911', // 🔴 change this
  database: 'campus_recruitment'
});

db.connect(err => {
  if (err) {
    console.log('DB Error:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// 🧪 Test route
app.get('/', (req, res) => {
  res.send('Server is working');
});

// 📊 Get students
app.get('/students', (req, res) => {
  db.query('SELECT * FROM students', (err, result) => {
    if (err) {
      res.send(err);
    } else {
      res.json(result);
    }
  });
});

// ➕ Add student
app.post('/students', (req, res) => {
  const { name, email, cgpa, branch } = req.body;

  db.query(
    'INSERT INTO students (name, email, cgpa, branch) VALUES (?, ?, ?, ?)',
    [name, email, cgpa, branch],
    (err) => {
      if (err) {
        res.send(err);
      } else {
        res.send('Student added');
      }
    }
  );
});

// ▶️ Start server
app.listen(5000, () => {
  console.log('🚀 Server running on port 5000');
});