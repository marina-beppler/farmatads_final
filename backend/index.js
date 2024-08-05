// index.js
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
const codes = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

app.post('/send-code', async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email é obrigatório!' });
  }
  
  const code = Math.floor(100000 + Math.random() * 900000).toString(); 
  codes[email] = code; 

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Seu código de verificação',
    text: `Seu código de verificação é: ${code}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email enviado' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao enviar email' });
  }
});

app.post('/verify-code', (req, res) => {
  const { email, code } = req.body;
  
  if (codes[email] && codes[email] === code) {
    res.status(200).json({ valid: true });
  } else {
    res.status(400).json({ valid: false });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
