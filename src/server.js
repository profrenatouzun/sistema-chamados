const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos estáticos (CSS, JS, imagens)
app.use(express.static('public'));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Sistema de Chamados - API Documentation'
}));

// Rotas da API
app.use('/api/verificacao', require('./routes/verificacao'));
app.use('/api/reclamacoes', require('./routes/reclamacoes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/boletos', require('./routes/boletos'));
app.use('/api/chamados', require('./routes/chamados'));
app.use('/api/dialogflow', require('./routes/dialogflow'));

// Rotas das páginas web
app.use('/', require('./routes/web'));

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sistema de chamados funcionando' });
});

// Rota raiz - redireciona para dashboard se não for API
app.get('/api', (req, res) => {
  res.json({
    message: 'API Sistema de Chamados',
    version: '1.0.0',
    endpoints: {
      verificacao: '/api/verificacao',
      reclamacoes: '/api/reclamacoes',
      auth: '/api/auth',
      boletos: '/api/boletos',
      chamados: '/api/chamados'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📡 Acesse: http://localhost:${PORT}`);
  console.log(`📚 Documentação Swagger: http://localhost:${PORT}/api-docs`);
});

module.exports = app;

