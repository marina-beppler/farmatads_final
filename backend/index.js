require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const pool = require('./db');
const app = express();
const path = require('path');
app.use(cors({
  origin: '*'
}));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '..', 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  console.log('deu certo fml');
});

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

    const token = jwt.sign({ userId: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '730h' });
    res.json({ token, id: user.rows[0].id });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

let codes = {}; 

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
    codes[email] = code; 
    res.status(200).json({ message: 'Email enviado', code });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

app.post('/verify-code', (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email e código são obrigatórios!' });
  }

  const storedCode = codes[email];

  if (storedCode === code) {
    res.status(200).json({ valid: true });
  } else {
    res.status(400).json({ valid: false });
  }
});

app.post('/reset-password', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE farmatads.users SET password = $1 WHERE email = $2',
      [hashedPassword, email]
    );
    res.status(200).json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Erro ao redefinir a senha' });
  }
});

// Buscar todos os xaropes do usuário
app.get('/xarope', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const xaropeData = await pool.query(
      'SELECT id, nome, cor, horainicial, intervalotempo, qtddose FROM farmatads.xarope WHERE usuario = $1',
      [userId]
    );
    res.json(xaropeData.rows);
  } catch (error) {
    console.error('Error fetching xarope data:', userId);
    res.status(500).json({ error: 'Server error' });
  }
});

// Buscar um xarope específico pelo ID e pelo userId
app.get('/xarope/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const xaropeData = await pool.query(
      'SELECT id, nome, cor, horainicial, intervalotempo, dosagem, qtddose FROM farmatads.xarope WHERE id = $1',
      [id]
    );
    if (xaropeData.rows.length === 0) {
      return res.status(404).json({ error: 'Xarope não encontrado', id });
      
    }
    
    res.json(xaropeData.rows[0]);
  } catch (error) {
    console.error('Error fetching xarope by ID:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Criar um novo xarope para um usuário
app.post('/xarope', async (req, res) => {
  const { userId, tipo, nome, horaInicial, intervaloTempo, cor, dosagem, qtdDose } = req.body;

  if (!userId || !tipo || !nome || !horaInicial || !intervaloTempo || !cor || !dosagem || !qtdDose) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newXarope = await pool.query(
      'INSERT INTO farmatads.xarope (usuario, tipo, nome, horaInicial, intervaloTempo, cor, dosagem, qtdDose) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [userId, tipo, nome, horaInicial, intervaloTempo, cor, dosagem, qtdDose]
    );
    res.json(newXarope.rows[0]);
  } catch (error) {
    console.error('Error inserting xarope:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Atualizar um xarope do usuário
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

// Deletar um xarope
app.delete('/xarope/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteXarope = await pool.query(
      'DELETE FROM farmatads.xarope WHERE id = $1 RETURNING *',
      [id]
    );

    if (deleteXarope.rows.length === 0) {
      return res.status(404).json({ error: 'Xarope não encontrado' });
    }

    res.json(deleteXarope.rows[0]);
  } catch (error) {
    console.error('Error deleting xarope:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Buscar todas as cápsulas do usuário
app.get('/capsula', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const capsulaData = await pool.query(
      'SELECT id, nome, cor, horainicial, intervalotempo, qtdcapsula FROM farmatads.capsula WHERE usuario = $1',
      [userId]
    );
    res.json(capsulaData.rows);
  } catch (error) {
    console.error('Error fetching capsula data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Buscar uma cápsula específica pelo ID 
app.get('/capsula/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const capsulaData = await pool.query(
      'SELECT id, nome, cor, horainicial, intervalotempo, qtdcapsula FROM farmatads.capsula WHERE id = $1',
      [id]
    );
    if (capsulaData.rows.length === 0) {
      return res.status(404).json({ error: 'Capsula not found' });
    }
    
    res.json(capsulaData.rows[0]);
  } catch (error) {
    console.error('Error fetching capsula by ID:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Criar uma nova cápsula para o usuário
app.post('/capsula', async (req, res) => {
  const { userId, tipo, nome, horaInicial, intervaloTempo, cor, qtdCapsula } = req.body;

  if (!userId || !tipo || !nome || !horaInicial || !intervaloTempo || !cor || !qtdCapsula) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newCapsula = await pool.query(
      'INSERT INTO farmatads.capsula (usuario, tipo, nome, horaInicial, intervaloTempo, cor, qtdCapsula) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, tipo, nome, horaInicial, intervaloTempo, cor, qtdCapsula]
    );
    res.json(newCapsula.rows[0]);
  } catch (error) {
    console.error('Error inserting capsula:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Atualizar uma cápsula do usuário
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

// Deletar uma cápsula
app.delete('/capsula/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deleteCapsula = await pool.query(
      'DELETE FROM farmatads.capsula WHERE id = $1 RETURNING *',
      [id]
    );

    if (deleteCapsula.rows.length === 0) {
      return res.status(404).json({ error: 'Cápsula não encontrada' });
    }

    res.json(deleteCapsula.rows[0]);
  } catch (error) {
    console.error('Error deleting capsula:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


// Buscar todos os comprimidos do usuário
app.get('/comprimido', async (req, res) => {
  const userId = req.query.userId;
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const comprimidoData = await pool.query(
      'SELECT id, nome, cor, horainicial, intervalotempo, qtdcomprimido FROM farmatads.comprimido WHERE usuario = $1',
      [userId]
    );
    res.json(comprimidoData.rows);
  } catch (error) {
    console.error('Error fetching comprimido data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Buscar um comprimido específico pelo ID
app.get('/comprimido/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const comprimidoData = await pool.query(
      'SELECT id, nome, cor, horainicial, intervalotempo, qtdcomprimido FROM farmatads.comprimido WHERE id = $1',
      [id]
    );
    if (comprimidoData.rows.length === 0) {
      return res.status(404).json({ error: 'Comprimido not found' });
    }
    
    res.json(comprimidoData.rows[0]);
  } catch (error) {
    console.error('Error fetching comprimido by ID:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Criar um novo comprimido para o usuário
app.post('/comprimido', async (req, res) => {
  const { userId, tipo, nome, horaInicial, intervaloTempo, cor, qtdComprimido } = req.body;

  if (!userId || !tipo || !nome || !horaInicial || !intervaloTempo || !cor || !qtdComprimido) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
  }

  try {
    const newComprimido = await pool.query(
      'INSERT INTO farmatads.comprimido (usuario, tipo, nome, horaInicial, intervaloTempo, cor, qtdComprimido) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [userId, tipo, nome, horaInicial, intervaloTempo, cor, qtdComprimido]
    );
    res.json(newComprimido.rows[0]);
  } catch (error) {
    console.error('Error inserting comprimido:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Atualizar um comprimido do usuário
app.put('/comprimido/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, horainicial, intervalotempo, cor, qtdcomprimido } = req.body;

  try {
    await pool.query(
      'UPDATE farmatads.comprimido SET nome = $1, horainicial = $2, intervalotempo = $3, cor = $4, qtdcomprimido = $5 WHERE id = $6',
      [nome, horainicial, intervalotempo, cor, qtdcomprimido, id]
    );
    res.status(200).send('Comprimido updated successfully');
  } catch (error) {
    console.error('Error updating comprimido:', error);
    res.status(500).send('Error updating comprimido');
  }
});

// Deletar um comprimido do usuário
app.delete('/comprimido/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const deleteComprimido = await pool.query(
      'DELETE FROM farmatads.comprimido WHERE id = $1 RETURNING *',
      [id]
    );

    if (deleteComprimido.rows.length === 0) {
      return res.status(404).json({ error: 'Comprimido não encontrado' });
    }

    res.json(deleteComprimido.rows[0]);
  } catch (error) {
    console.error('Error deleting comprimido:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/update-remedio', async (req, res) => {
  const { id, time, type } = req.body;

  try {
    let tableName = '';
    let fieldToDecrement = '';
    let deleteRoute = '';

    if (type === 'xarope') {
      tableName = 'farmatads.xarope';
      fieldToDecrement = 'qtddose';
      deleteRoute = `/xarope/${id}`;
    } else if (type === 'capsula') {
      tableName = 'farmatads.capsula';
      fieldToDecrement = 'qtdcapsula';
      deleteRoute = `/capsula/${id}`;
    } else if (type === 'comprimido') {
      tableName = 'farmatads.comprimido';
      fieldToDecrement = 'qtdcomprimido';
      deleteRoute = `/comprimido/${id}`;
    }

    const result = await pool.query(
      `UPDATE ${tableName} SET horaInicial = $1, ${fieldToDecrement} = ${fieldToDecrement} - 1 WHERE id = $2 RETURNING ${fieldToDecrement}`,
      [time, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Medicação não encontrada' });
    }

    const newValue = result.rows[0][fieldToDecrement];

    if (newValue <= 0) {
      const deleteResult = await pool.query(`DELETE FROM ${tableName} WHERE id = $1 RETURNING *`, [id]);

      if (deleteResult.rows.length === 0) {
        return res.status(404).json({ error: 'Medicação não encontrada' });
      }

      return res.json({ message: 'Medicação deletada', deleted: deleteResult.rows[0] });
    }

    res.json({ message: 'Medicação atualizada', updated: result.rows[0] });
  } catch (error) {
    console.error('Error updating medication:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
