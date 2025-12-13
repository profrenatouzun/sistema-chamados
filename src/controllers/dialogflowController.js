const axios = require('axios');

// URL base para chamadas internas da API
// Em produção, pode ser configurado via variável de ambiente
const BASE_URL = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;

/**
 * Processa requisições do Dialogflow
 */
const processarWebhook = async (req, res) => {
  try {
    const intent = req.body.queryResult?.intent?.displayName || req.body.intent?.displayName;
    const parameters = req.body.queryResult?.parameters || req.body.parameters || {};

    console.log('Intent recebida:', intent);
    console.log('Parâmetros:', parameters);

    let fulfillmentText = '';

    // Processar baseado na intenção
    switch (intent) {
      case 'consultar_cep':
      case 'verificar_cep':
        fulfillmentText = await processarConsultarCEP(parameters);
        break;

      case 'abrir_chamado':
      case 'criar_chamado':
        fulfillmentText = await processarAbrirChamado(parameters);
        break;

      case 'abrir_reclamacao':
      case 'criar_reclamacao':
        fulfillmentText = await processarAbrirReclamacao(parameters);
        break;

      case 'reset_senha':
      case 'redefinir_senha':
      case 'esqueci_senha':
        fulfillmentText = await processarResetSenha(parameters);
        break;

      case 'segunda_via_boleto':
      case 'gerar_segunda_via':
        fulfillmentText = await processarSegundaViaBoleto(parameters);
        break;

      default:
        fulfillmentText = 'Desculpe, não entendi sua solicitação. Por favor, tente novamente.';
    }

    // Resposta no formato Dialogflow
    res.json({
      fulfillmentText: fulfillmentText,
      fulfillmentMessages: [{
        text: {
          text: [fulfillmentText]
        }
      }]
    });

  } catch (error) {
    console.error('Erro ao processar webhook do Dialogflow:', error);
    res.json({
      fulfillmentText: 'Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.',
      fulfillmentMessages: [{
        text: {
          text: ['Desculpe, ocorreu um erro ao processar sua solicitação. Por favor, tente novamente mais tarde.']
        }
      }]
    });
  }
};

/**
 * Processa consulta de CEP
 */
const processarConsultarCEP = async (parameters) => {
  try {
    const cep = parameters.cep || parameters['cep-number'] || parameters['zip-code'];
    
    if (!cep) {
      return 'Por favor, informe o CEP que deseja consultar.';
    }

    // Limpar CEP (remover caracteres não numéricos)
    const cepLimpo = cep.toString().replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return 'CEP inválido. Por favor, informe um CEP com 8 dígitos.';
    }

    // Chamar API interna
    const response = await axios.get(`${BASE_URL}/api/verificacao/cep/${cepLimpo}`);
    const resultado = response.data;

    return `✅ Verificação realizada com sucesso!\n\n` +
           `CEP: ${resultado.cep}\n` +
           `Endereço: ${resultado.endereco.logradouro}, ${resultado.endereco.bairro}\n` +
           `Cidade: ${resultado.endereco.cidade} - ${resultado.endereco.uf}\n` +
           `Serviço Disponível: ${resultado.servicoDisponivel ? 'Sim ✅' : 'Não ❌'}\n` +
           `${resultado.mensagem || ''}`;
  } catch (error) {
    if (error.response) {
      return error.response.data.message || 'Não foi possível verificar o CEP. Por favor, tente novamente.';
    }
    return 'Erro ao consultar CEP. Por favor, verifique se o CEP está correto e tente novamente.';
  }
};

/**
 * Processa abertura de chamado
 */
const processarAbrirChamado = async (parameters) => {
  try {
    const nome = parameters.nome || parameters['person-name'] || 'Usuário';
    const email = parameters.email || parameters['email-address'];
    const telefone = parameters.telefone || parameters['phone-number'];
    const categoria = parameters.categoria || parameters.categoria_chamado || 'outros';
    const assunto = parameters.assunto || parameters.titulo || 'Chamado via Chatbot';
    const descricao = parameters.descricao || parameters.mensagem || 'Chamado aberto através do chatbot';
    const prioridade = parameters.prioridade || 'media';

    if (!email) {
      return 'Para abrir um chamado, preciso do seu email. Por favor, informe seu endereço de email.';
    }

    // Chamar API interna
    const response = await axios.post(`${BASE_URL}/api/chamados`, {
      nome,
      email,
      telefone,
      categoria,
      assunto,
      descricao,
      prioridade
    });

    const chamado = response.data.chamado;

    return `✅ Chamado aberto com sucesso!\n\n` +
           `Número do Chamado: ${chamado.numero}\n` +
           `Assunto: ${chamado.assunto}\n` +
           `Status: ${chamado.status}\n` +
           `Prioridade: ${chamado.prioridade}\n\n` +
           `Você receberá atualizações sobre este chamado em seu email.`;
  } catch (error) {
    if (error.response) {
      return error.response.data.message || 'Não foi possível abrir o chamado. Por favor, tente novamente.';
    }
    return 'Erro ao abrir chamado. Por favor, verifique os dados informados e tente novamente.';
  }
};

/**
 * Processa abertura de reclamação
 */
const processarAbrirReclamacao = async (parameters) => {
  try {
    const nome = parameters.nome || parameters['person-name'] || 'Usuário';
    const email = parameters.email || parameters['email-address'];
    const telefone = parameters.telefone || parameters['phone-number'];
    const assunto = parameters.assunto || parameters.titulo;
    const descricao = parameters.descricao || parameters.mensagem || 'Reclamação registrada através do chatbot';
    const cep = parameters.cep || parameters['cep-number'];

    if (!email) {
      return 'Para abrir uma reclamação, preciso do seu email. Por favor, informe seu endereço de email.';
    }

    if (!assunto) {
      return 'Por favor, informe o assunto da sua reclamação.';
    }

    // Chamar API interna
    const response = await axios.post(`${BASE_URL}/api/reclamacoes`, {
      nome,
      email,
      telefone,
      assunto,
      descricao,
      cep
    });

    const reclamacao = response.data.reclamacao;

    return `✅ Reclamação registrada com sucesso!\n\n` +
           `ID da Reclamação: ${reclamacao.id}\n` +
           `Assunto: ${reclamacao.assunto}\n` +
           `Status: ${reclamacao.status}\n\n` +
           `Sua reclamação será analisada e você receberá uma resposta em seu email.`;
  } catch (error) {
    if (error.response) {
      return error.response.data.message || 'Não foi possível registrar a reclamação. Por favor, tente novamente.';
    }
    return 'Erro ao registrar reclamação. Por favor, verifique os dados informados e tente novamente.';
  }
};

/**
 * Processa reset de senha
 */
const processarResetSenha = async (parameters) => {
  try {
    const email = parameters.email || parameters['email-address'];

    if (!email) {
      return 'Para redefinir sua senha, preciso do seu email. Por favor, informe seu endereço de email.';
    }

    // Chamar API interna
    const response = await axios.post(`${BASE_URL}/api/auth/reset-senha`, {
      email
    });

    const resultado = response.data;

    return `✅ Senha redefinida com sucesso!\n\n` +
           `Uma nova senha foi gerada e enviada para: ${email}\n` +
           `Nova senha: ${resultado.novaSenha}\n\n` +
           `⚠️ IMPORTANTE: Por favor, altere esta senha após o primeiro acesso por segurança.`;
  } catch (error) {
    if (error.response) {
      return error.response.data.message || 'Não foi possível redefinir a senha. Verifique se o email está correto e tente novamente.';
    }
    return 'Erro ao redefinir senha. Por favor, verifique o email informado e tente novamente.';
  }
};

/**
 * Processa segunda via de boleto
 */
const processarSegundaViaBoleto = async (parameters) => {
  try {
    const cpf = parameters.cpf || parameters['cpf-number'] || parameters.documento;
    const data = parameters.data || parameters['date'] || parameters['data-vencimento'];
    const email = parameters.email || parameters['email-address'];

    if (!cpf) {
      return 'Para gerar a segunda via do boleto, preciso do seu CPF. Por favor, informe seu CPF.';
    }

    if (!data) {
      return 'Para gerar a segunda via do boleto, preciso da data de vencimento. Por favor, informe a data do boleto (formato: YYYY-MM-DD).';
    }

    // Chamar API interna
    const response = await axios.post(`${BASE_URL}/api/boletos/segunda-via`, {
      cpf,
      data,
      email
    });

    const resultado = response.data;
    const boleto = resultado.boleto;

    let resposta = `✅ Segunda via gerada com sucesso!\n\n` +
                   `Código do Boleto: ${boleto.codigo}\n` +
                   `Valor: R$ ${boleto.valor.toFixed(2)}\n` +
                   `Vencimento: ${new Date(boleto.vencimento).toLocaleDateString('pt-BR')}\n` +
                   `Status: ${boleto.status}\n` +
                   `Linha Digitável: ${boleto.linhaDigitavel}\n`;

    if (resultado.linkSegundaVia) {
      resposta += `\nLink: ${resultado.linkSegundaVia}\n`;
    }

    if (email) {
      resposta += `\nUma cópia foi enviada para: ${email}`;
    }

    return resposta;
  } catch (error) {
    if (error.response) {
      return error.response.data.message || 'Não foi possível gerar a segunda via do boleto. Verifique os dados informados e tente novamente.';
    }
    return 'Erro ao gerar segunda via do boleto. Por favor, verifique o CPF e a data informados e tente novamente.';
  }
};

module.exports = {
  processarWebhook
};
