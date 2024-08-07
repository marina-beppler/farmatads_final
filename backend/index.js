require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pool = require('./db');
const app = express();
app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      'INSERT INTO farmatads.users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, hashedPassword]
    );
    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '730h' });
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const user = await pool.query('SELECT * FROM farmatads.users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ error: 'Credenciais inválidas!' });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(400).json({ error: 'Credenciais inválidas!' });
    }

    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/send-code', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório!' });
  }
  
  const code = Math.floor(100000 + Math.random() * 900000).toString(); 

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Seu código de verificação',
    text: `Seu código de verificação é: ${code}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email enviado', code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

app.get('/xarope', async (req, res) => {
  try {
    const xaropeData = await pool.query('SELECT nome, cor FROM farmatads.xarope'); 
    res.json(xaropeData.rows);
  } catch (error) {
    console.error('Error fetching xarope data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/xarope', async (req, res) => {
  const { tipo, nome, horaInicial, intervaloTempo, cor, dosagem, qtdDose } = req.body;

  if (!tipo || !nome || !horaInicial || !intervaloTempo || !cor || !dosagem || !qtdDose) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newXarope = await pool.query(
      'INSERT INTO farmatads.xarope (tipo, nome, horaInicial, intervaloTempo, cor, dosagem, qtdDose) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [tipo, nome, horaInicial, intervaloTempo, cor, dosagem, qtdDose]
    );
    res.json(newXarope.rows[0]);
  } catch (error) {
    console.error('Error inserting xarope:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/capsula', async (req, res) => {
  try {
    const capsulaData = await pool.query('SELECT nome, cor FROM farmatads.capsula'); 
    res.json(capsulaData.rows);
  } catch (error) {
    console.error('Error fetching capsula data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/capsula', async (req, res) => {
  const { tipo, nome, horaInicial, intervaloTempo, cor, qtdCapsula } = req.body;

  if (!tipo || !nome || !horaInicial || !intervaloTempo || !cor || !qtdCapsula) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newCapsula = await pool.query(
      'INSERT INTO farmatads.capsula (tipo, nome, horaInicial, intervaloTempo, cor, qtdCapsula) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tipo, nome, horaInicial, intervaloTempo, cor, qtdCapsula]
    );
    res.json(newCapsula.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/comprimido', async (req, res) => {
  const { tipo, nome, horaInicial, intervaloTempo, cor, qtdComprimido } = req.body;

  if (!tipo || !nome || !horaInicial || !intervaloTempo || !cor || !qtdComprimido) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newComprimido = await pool.query(
      'INSERT INTO farmatads.comprimido (tipo, nome, horaInicial, intervaloTempo, cor, qtdComprimido) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tipo, nome, horaInicial, intervaloTempo, cor, qtdComprimido]
    );
    res.json(newComprimido.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
