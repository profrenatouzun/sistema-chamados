const express = require('express');
const path = require('path');
const router = express.Router();

// Rota raiz - Dashboard
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/index.html'));
});

// Rota para página de chamados
router.get('/chamados', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/chamados.html'));
});

// Rota para página de reclamações
router.get('/reclamacoes', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/reclamacoes.html'));
});

// Rota para página de boletos
router.get('/boletos', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/boletos.html'));
});

// Rota para página de verificação de CEP
router.get('/verificacao', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/verificacao.html'));
});

module.exports = router;

