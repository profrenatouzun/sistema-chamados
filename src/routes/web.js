const express = require('express');
const path = require('path');
const router = express.Router();

// Rota de login
router.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/login.html'));
});

// Rota para área do usuário
router.get('/user', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/user.html'));
});

// Rota raiz - Dashboard (admin)
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Rota para página de chamados (admin)
router.get('/chamados', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/chamados.html'));
});

// Rota para página de reclamações (admin)
router.get('/reclamacoes', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/reclamacoes.html'));
});

// Rota para página de boletos (admin)
router.get('/boletos', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/boletos.html'));
});

// Rota para página de verificação de CEP (admin)
router.get('/verificacao', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/verificacao.html'));
});

module.exports = router;

