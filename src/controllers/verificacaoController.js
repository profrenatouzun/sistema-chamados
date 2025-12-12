const axios = require('axios');

/**
 * Verifica se o serviço está disponível na região do CEP
 */
const verificarPorCEP = async (req, res) => {
  try {
    const { cep } = req.body;

    if (!cep) {
      return res.status(400).json({
        error: 'CEP é obrigatório',
        message: 'Por favor, informe o CEP para verificação'
      });
    }

    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      return res.status(400).json({
        error: 'CEP inválido',
        message: 'CEP deve conter 8 dígitos'
      });
    }

    // Busca informações do CEP na API ViaCEP
    let cepInfo;
    try {
      const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      cepInfo = response.data;

      if (cepInfo.erro) {
        return res.status(404).json({
          error: 'CEP não encontrado',
          message: 'O CEP informado não foi encontrado'
        });
      }
    } catch (error) {
      return res.status(500).json({
        error: 'Erro ao consultar CEP',
        message: 'Não foi possível consultar o CEP no momento'
      });
    }

    // Regiões atendidas (simulado - pode ser configurado)
    const regioesAtendidas = [
      'SP', 'RJ', 'MG', 'RS', 'PR', 'SC', 'BA', 'GO', 'PE', 'CE'
    ];

    const disponivel = regioesAtendidas.includes(cepInfo.uf);

    res.json({
      cep: cepLimpo,
      endereco: {
        logradouro: cepInfo.logradouro || 'Não informado',
        bairro: cepInfo.bairro || 'Não informado',
        cidade: cepInfo.localidade,
        uf: cepInfo.uf
      },
      servicoDisponivel: disponivel,
      mensagem: disponivel
        ? `Serviço disponível na região de ${cepInfo.localidade} - ${cepInfo.uf}`
        : `Serviço não disponível na região de ${cepInfo.localidade} - ${cepInfo.uf}`
    });
  } catch (error) {
    console.error('Erro ao verificar CEP:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível verificar o CEP'
    });
  }
};

/**
 * Verifica CEP via GET
 */
const verificarPorCEPGet = async (req, res) => {
  req.body = { cep: req.params.cep };
  return verificarPorCEP(req, res);
};

module.exports = {
  verificarPorCEP,
  verificarPorCEPGet
};

