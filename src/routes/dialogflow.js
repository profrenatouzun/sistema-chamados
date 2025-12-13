const express = require('express');
const router = express.Router();
const dialogflowController = require('../controllers/dialogflowController');

/**
 * @swagger
 * /api/dialogflow/webhook:
 *   post:
 *     summary: Webhook para integração com Dialogflow
 *     description: |
 *       Processa requisições do Dialogflow e retorna respostas formatadas.
 *       
 *       **Intenções suportadas:**
 *       - `consultar_cep` ou `verificar_cep` - Consulta disponibilidade de serviço por CEP
 *       - `abrir_chamado` ou `criar_chamado` - Cria um novo chamado de suporte
 *       - `abrir_reclamacao` ou `criar_reclamacao` - Registra uma nova reclamação
 *       - `reset_senha`, `redefinir_senha` ou `esqueci_senha` - Gera nova senha automaticamente
 *       - `segunda_via_boleto` ou `gerar_segunda_via` - Gera segunda via de boleto
 *     tags: [Dialogflow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - queryResult
 *             properties:
 *               queryResult:
 *                 type: object
 *                 properties:
 *                   intent:
 *                     type: object
 *                     properties:
 *                       displayName:
 *                         type: string
 *                         description: Nome da intenção
 *                         example: "consultar_cep"
 *                   parameters:
 *                     type: object
 *                     description: Parâmetros extraídos da conversa
 *                     example:
 *                       cep: "01310100"
 *                   queryText:
 *                     type: string
 *                     description: Texto original da consulta
 *                     example: "Quero consultar o CEP 01310100"
 *               intent:
 *                 type: object
 *                 description: Formato alternativo (sem queryResult)
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
 *                   description: Texto de resposta para o usuário
 *                   example: "✅ Verificação realizada com sucesso!\n\nCEP: 01310100\nEndereço: Avenida Paulista, Bela Vista\nCidade: São Paulo - SP\nServiço Disponível: Sim ✅"
 *                 fulfillmentMessages:
 *                   type: array
 *                   description: Array de mensagens formatadas
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
 *       400:
 *         description: Parâmetros inválidos ou faltando
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fulfillmentText:
 *                   type: string
 *                   example: "Por favor, informe o CEP que deseja consultar."
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 fulfillmentText:
 *                   type: string
 *                   example: "Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde."
 */
router.post('/webhook', dialogflowController.processarWebhook);

module.exports = router;

