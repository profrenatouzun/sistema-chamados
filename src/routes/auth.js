const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/alterar-senha:
 *   post:
 *     summary: Altera a senha do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AlterarSenha'
 *     responses:
 *       200:
 *         description: Senha alterada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Senha atual incorreta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/alterar-senha', authController.alterarSenha);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Realiza login do usuário
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 usuario:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     nome:
 *                       type: string
 *       400:
 *         description: Campos obrigatórios faltando
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/reset-senha:
 *   post:
 *     summary: Reseta a senha do usuário (gera nova senha automaticamente)
 *     description: Gera uma nova senha aleatória para o usuário e simula o envio por email. A nova senha é retornada na resposta para uso do chatbot.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetSenha'
 *     responses:
 *       200:
 *         description: Senha redefinida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Senha redefinida com sucesso. Uma nova senha foi gerada e enviada por email."
 *                 email:
 *                   type: string
 *                   example: "usuario@exemplo.com"
 *                 novaSenha:
 *                   type: string
 *                   description: Nova senha gerada (retornada para uso do chatbot)
 *                   example: "aB3xY9mK"
 *                 emailEnviado:
 *                   type: boolean
 *                   example: true
 *                 detalhesEmail:
 *                   type: object
 *                   properties:
 *                     para:
 *                       type: string
 *                     assunto:
 *                       type: string
 *                     dataEnvio:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Email inválido ou não informado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro ao processar reset de senha
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/reset-senha', authController.resetSenha);

module.exports = router;

