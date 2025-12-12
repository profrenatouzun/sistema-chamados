const express = require('express');
const router = express.Router();
const reclamacoesController = require('../controllers/reclamacoesController');

/**
 * @swagger
 * /api/reclamacoes:
 *   post:
 *     summary: Cria uma nova reclamação
 *     tags: [Reclamações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Reclamacao'
 *     responses:
 *       201:
 *         description: Reclamação criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 reclamacao:
 *                   $ref: '#/components/schemas/ReclamacaoResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', reclamacoesController.criarReclamacao);

/**
 * @swagger
 * /api/reclamacoes:
 *   get:
 *     summary: Lista todas as reclamações
 *     tags: [Reclamações]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [aberta, em_analise, resolvida, cancelada]
 *         description: Filtrar por status
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Filtrar por email
 *     responses:
 *       200:
 *         description: Lista de reclamações
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                 reclamacoes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ReclamacaoResponse'
 */
router.get('/', reclamacoesController.listarReclamacoes);

/**
 * @swagger
 * /api/reclamacoes/{id}:
 *   get:
 *     summary: Busca uma reclamação por ID
 *     tags: [Reclamações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reclamação
 *     responses:
 *       200:
 *         description: Reclamação encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ReclamacaoResponse'
 *       404:
 *         description: Reclamação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', reclamacoesController.buscarReclamacao);

/**
 * @swagger
 * /api/reclamacoes/{id}/status:
 *   put:
 *     summary: Atualiza o status de uma reclamação
 *     tags: [Reclamações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da reclamação
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
 *                 enum: [aberta, em_analise, resolvida, cancelada]
 *                 example: resolvida
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
 *                 reclamacao:
 *                   $ref: '#/components/schemas/ReclamacaoResponse'
 *       400:
 *         description: Status inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Reclamação não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id/status', reclamacoesController.atualizarStatus);

module.exports = router;

