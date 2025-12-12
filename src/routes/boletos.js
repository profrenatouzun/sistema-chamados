const express = require('express');
const router = express.Router();
const boletosController = require('../controllers/boletosController');

/**
 * @swagger
 * /api/boletos/segunda-via:
 *   post:
 *     summary: Gera segunda via do boleto com código aleatório
 *     description: Gera uma segunda via do boleto baseado no CPF e data. O sistema gera automaticamente um código único para o boleto.
 *     tags: [Boletos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SegundaViaBoleto'
 *     responses:
 *       200:
 *         description: Segunda via gerada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 boleto:
 *                   type: object
 *                   properties:
 *                     codigo:
 *                       type: string
 *                       description: Código aleatório gerado para o boleto
 *                     valor:
 *                       type: number
 *                     vencimento:
 *                       type: string
 *                     status:
 *                       type: string
 *                     linhaDigitavel:
 *                       type: string
 *                       description: Linha digitável do boleto brasileiro (formato padrão)
 *                       example: "34191.79001 01043.510047 91020.150008 1 84460000015000"
 *                     cliente:
 *                       type: object
 *                       properties:
 *                         nome:
 *                           type: string
 *                         cpf:
 *                           type: string
 *                 linkSegundaVia:
 *                   type: string
 *                 emailEnviado:
 *                   type: string
 *                   nullable: true
 *                 dataSolicitacao:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: CPF ou data inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/segunda-via', boletosController.solicitarSegundaVia);

/**
 * @swagger
 * /api/boletos/{codigo}:
 *   get:
 *     summary: Busca informações de um boleto
 *     tags: [Boletos]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *         description: Código do boleto
 *     responses:
 *       200:
 *         description: Informações do boleto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 codigo:
 *                   type: string
 *                 valor:
 *                   type: number
 *                 vencimento:
 *                   type: string
 *                 status:
 *                   type: string
 *                 cliente:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *       404:
 *         description: Boleto não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:codigo', boletosController.buscarBoleto);

module.exports = router;

