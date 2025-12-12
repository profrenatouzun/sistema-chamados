const express = require('express');
const router = express.Router();
const verificacaoController = require('../controllers/verificacaoController');

/**
 * @swagger
 * /api/verificacao/cep:
 *   post:
 *     summary: Verifica se o serviço está disponível na região do CEP
 *     tags: [Verificação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VerificacaoCEP'
 *     responses:
 *       200:
 *         description: Verificação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificacaoCEPResponse'
 *       400:
 *         description: CEP inválido ou faltando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: CEP não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/cep', verificacaoController.verificarPorCEP);

/**
 * @swagger
 * /api/verificacao/cep/{cep}:
 *   get:
 *     summary: Verifica se o serviço está disponível na região do CEP (GET)
 *     tags: [Verificação]
 *     parameters:
 *       - in: path
 *         name: cep
 *         required: true
 *         schema:
 *           type: string
 *         description: CEP para verificação (formato 01310-100 ou 01310100)
 *     responses:
 *       200:
 *         description: Verificação realizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerificacaoCEPResponse'
 *       400:
 *         description: CEP inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: CEP não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/cep/:cep', verificacaoController.verificarPorCEPGet);

module.exports = router;

