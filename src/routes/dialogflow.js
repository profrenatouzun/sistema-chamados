const express = require('express');
const router = express.Router();
const dialogflowController = require('../controllers/dialogflowController');

/**
 * @swagger
 * /api/dialogflow/webhook:
 *   post:
 *     summary: Webhook para integração com Dialogflow
 *     description: Processa requisições do Dialogflow e retorna respostas formatadas. Suporta as intenções: consultar_cep, abrir_chamado, abrir_reclamacao, reset_senha, segunda_via_boleto
 *     tags: [Dialogflow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               queryResult:
 *                 type: object
 *                 properties:
 *                   intent:
 *                     type: object
 *                     properties:
 *                       displayName:
 *                         type: string
 *                         example: "consultar_cep"
 *                   parameters:
 *                     type: object
 *                     example:
 *                       cep: "01310100"
 *               intent:
 *                 type: object
 *                 properties:
 *                   displayName:
 *                     type: string
 *     responses:
 *       200:
 *         description: Resposta formatada para o Dialogflow
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fulfillmentText:
 *                   type: string
 *                   example: "✅ Verificação realizada com sucesso!"
 *                 fulfillmentMessages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       text:
 *                         type: object
 *                         properties:
 *                           text:
 *                             type: array
 *                             items:
 *                               type: string
 */
router.post('/webhook', dialogflowController.processarWebhook);

module.exports = router;

