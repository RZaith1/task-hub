const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'taskhub',
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword]);
  res.sendStatus(201);
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password))) return res.sendStatus(401);
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET);
  res.json({ token });
});

app.get('/tasks', authenticateToken, async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
  res.json(rows);
});

app.post('/tasks', authenticateToken, async (req, res) => {
  const { title, category, priority, due_date } = req.body;
  await pool.query(
    'INSERT INTO tasks (user_id, title, category, priority, due_date) VALUES (?, ?, ?, ?, ?)',
    [req.user.id, title, category, priority, due_date]
  );
  res.sendStatus(201);
});

app.put('/tasks/:id', authenticateToken, async (req, res) => {
  const { title, category, priority, due_date } = req.body;
  await pool.query(
    'UPDATE tasks SET title = ?, category = ?, priority = ?, due_date = ? WHERE id = ? AND user_id = ?',
    [title, category, priority, due_date, req.params.id, req.user.id]
  );
  res.sendStatus(200);
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.sendStatus(204);
});

app.listen(3000, () => console.log('Server running on port 3000'));
