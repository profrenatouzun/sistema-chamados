const express = require('express');
const router = express.Router();
const chamadosController = require('../controllers/chamadosController');

/**
 * @swagger
 * /api/chamados:
 *   post:
 *     summary: Abre um novo chamado
 *     tags: [Chamados]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Chamado'
 *     responses:
 *       201:
 *         description: Chamado aberto com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 chamado:
 *                   $ref: '#/components/schemas/ChamadoResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', chamadosController.abrirChamado);

/**
 * @swagger
 * /api/chamados/categorias:
 *   get:
 *     summary: Lista as categorias possíveis de um chamado
 *     tags: [Chamados]
 *     responses:
 *       200:
 *         description: Lista de categorias
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["tecnico", "financeiro", "comercial", "suporte", "outros"]
 */
router.get('/categorias', chamadosController.listarCategorias);

/**
 * @swagger
 * /api/chamados/status:
 *   get:
 *     summary: Lista os status possíveis de um chamado
 *     tags: [Chamados]
 *     responses:
 *       200:
 *         description: Lista de status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["aberto", "em_andamento", "aguardando_cliente", "resolvido", "fechado"]
 */
router.get('/status', chamadosController.listarStatus);

/**
 * @swagger
 * /api/chamados:
 *   get:
 *     summary: Lista todos os chamados
 *     tags: [Chamados]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberto, em_andamento, aguardando_cliente, resolvido, fechado]
 *         description: Filtrar por status
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *           enum: [tecnico, financeiro, comercial, suporte, outros]
 *         description: Filtrar por categoria
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *       - in: query
 *         name: prioridade
 *         schema:
 *           type: string
 *           enum: [baixa, media, alta, urgente]
 *         description: Filtrar por prioridade
 *     responses:
 *       200:
 *         description: Lista de chamados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 chamados:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ChamadoResponse'
 */
router.get('/', chamadosController.listarChamados);

/**
 * @swagger
 * /api/chamados/{id}:
 *   get:
 *     summary: Busca um chamado por ID
 *     tags: [Chamados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ou número do chamado
 *     responses:
 *       200:
 *         description: Chamado encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChamadoResponse'
 *       404:
 *         description: Chamado não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', chamadosController.buscarChamado);

/**
 * @swagger
 * /api/chamados/{id}/status:
 *   put:
 *     summary: Atualiza o status de um chamado
 *     tags: [Chamados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ou número do chamado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [aberto, em_andamento, aguardando_cliente, resolvido, fechado]
 *                 example: em_andamento
 *     responses:
 *       200:
 *         description: Status atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 chamado:
 *                   $ref: '#/components/schemas/ChamadoResponse'
 *       400:
 *         description: Status inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Chamado não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/status', chamadosController.atualizarStatus);

/**
 * @swagger
 * /api/chamados/{id}/mensagens:
 *   post:
 *     summary: Adiciona uma mensagem a um chamado
 *     tags: [Chamados]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ou número do chamado
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MensagemChamado'
 *     responses:
 *       200:
 *         description: Mensagem adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 mensagem:
 *                   type: object
 *                 chamado:
 *                   $ref: '#/components/schemas/ChamadoResponse'
 *       400:
 *         description: Mensagem obrigatória
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Chamado não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id/mensagens', chamadosController.adicionarMensagem);

module.exports = router;

