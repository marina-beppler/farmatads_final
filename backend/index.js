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
    const xaropeData = await pool.query('SELECT id, nome, cor, horainicial, intervalotempo FROM farmatads.xarope');
    res.json(xaropeData.rows);
  } catch (error) {
    console.error('Error fetching xarope data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/xarope/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const xaropeData = await pool.query('SELECT id, nome, cor, horainicial, intervalotempo, dosagem, qtddose FROM farmatads.xarope WHERE id = $1', [id]);
    if (xaropeData.rows.length === 0) {
      return res.status(404).json({ error: 'Xarope não encontrado' });
    }
    
    res.json(xaropeData.rows[0]);
  } catch (error) {
    console.error('Error fetching xarope by ID:', error.message);
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

app.put('/xarope/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, qtddose, dosagem, horainicial, intervalotempo, cor } = req.body;

  try {
    await pool.query(
      'UPDATE farmatads.xarope SET nome = $1, qtddose = $2, dosagem = $3, horainicial = $4, cor = $5, intervalotempo = $6 WHERE id = $7',
      [nome, qtddose, dosagem, horainicial, cor, intervalotempo, id]
    );
    res.status(200).send('Xarope updated successfully');
  } catch (error) {
    console.error('Error updating xarope:', error);
    res.status(500).send('Error updating xarope');
  }
});

app.delete('/xarope/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteXarope = await pool.query('DELETE FROM farmatads.xarope WHERE id = $1 RETURNING *', [id]);

    if (deleteXarope.rows.length === 0) {
      return res.status(404).json({ error: 'Xarope não encontrado' });
    }

    res.json(deleteXarope.rows[0]);
  } catch (error) {
    console.error('Error deleting xarope:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/capsula', async (req, res) => {
  try {
    const capsulaData = await pool.query('SELECT id, nome, cor, horainicial, intervalotempo FROM farmatads.capsula');
    res.json(capsulaData.rows);
  } catch (error) {
    console.error('Error fetching capsula data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/capsula', async (req, res) => {
  const { tipo, nome, horainicial, intervalotempo, cor, qtdCapsula } = req.body;

  if (!tipo || !nome || !horainicial || !intervalotempo || !cor || !qtdCapsula) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newCapsula = await pool.query(
      'INSERT INTO farmatads.capsula (tipo, nome, horainicial, intervalotempo, cor, qtdCapsula) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tipo, nome, horainicial, intervalotempo, cor, qtdCapsula]
    );
    res.json(newCapsula.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/capsula/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, qtdcapsula, horainicial, intervalotempo, cor } = req.body;

  try {
    await pool.query(
      'UPDATE farmatads.capsula SET nome = $1, qtdcapsula = $2, horainicial = $3, cor = $4, intervalotempo = $5 WHERE id = $6',
      [nome, qtdcapsula, horainicial, cor, intervalotempo, id]
    );
    res.status(200).send('Capsula updated successfully');
  } catch (error) {
    console.error('Error updating capsula:', error);
    res.status(500).send('Error updating capsula');
  }
});

app.delete('/capsula/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteCapsula = await pool.query('DELETE FROM farmatads.capsula WHERE id = $1 RETURNING *', [id]);

    if (deleteCapsula.rows.length === 0) {
      return res.status(404).json({ error: 'Cápsula não encontrada' });
    }

    res.json(deleteCapsula.rows[0]);
  } catch (error) {
    console.error('Error deleting capsula:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/comprimido', async (req, res) => {
  try {
    const comprimidoData = await pool.query('SELECT id, nome, cor, horainicial, intervalotempo FROM farmatads.comprimido');
    res.json(comprimidoData.rows);
  } catch (error) {
    console.error('Error fetching comprimido data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/comprimido', async (req, res) => {
  const { tipo, nome, horainicial, intervalotempo, cor, qtdComprimido } = req.body;

  if (!tipo || !nome || !horainicial || !intervalotempo || !cor || !qtdComprimido) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newComprimido = await pool.query(
      'INSERT INTO farmatads.comprimido (tipo, nome, horainicial, intervalotempo, cor, qtdComprimido) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tipo, nome, horainicial, intervalotempo, cor, qtdComprimido]
    );
    res.json(newComprimido.rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/comprimido/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, qtd, horainicial, cor } = req.body;

  try {
    await pool.query(
      'UPDATE comprimido SET nome = $1, qtd = $2, horainicial = $3, cor = $4 WHERE id = $5',
      [nome, qtd, horainicial, cor, id]
    );
    res.status(200).send('Comprimido updated successfully');
  } catch (error) {
    console.error('Error updating comprimido:', error);
    res.status(500).send('Error updating comprimido');
  }
});


app.delete('/comprimido/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteComprimido = await pool.query('DELETE FROM farmatads.comprimido WHERE id = $1 RETURNING *', [id]);

    if (deleteComprimido.rows.length === 0) {
      return res.status(404).json({ error: 'Comprimido não encontrado' });
    }

    res.json(deleteComprimido.rows[0]);
  } catch (error) {
    console.error('Error deleting comprimido:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
