// Armazenamento em memória (simulado - em produção usar banco de dados)
let reclamacoes = [];
let proximoId = 1;

/**
 * Cria uma nova reclamação
 */
const criarReclamacao = (req, res) => {
  try {
    const { nome, email, telefone, assunto, descricao, cep } = req.body;

    // Validações
    if (!nome || !email || !assunto || !descricao) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando',
        message: 'Nome, email, assunto e descrição são obrigatórios'
      });
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Por favor, informe um email válido'
      });
    }

    const novaReclamacao = {
      id: proximoId++,
      nome,
      email,
      telefone: telefone || null,
      assunto,
      descricao,
      cep: cep || null,
      status: 'aberta',
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    reclamacoes.push(novaReclamacao);

    res.status(201).json({
      message: 'Reclamação criada com sucesso',
      reclamacao: novaReclamacao
    });
  } catch (error) {
    console.error('Erro ao criar reclamação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível criar a reclamação'
    });
  }
};

/**
 * Lista todas as reclamações
 */
const listarReclamacoes = (req, res) => {
  try {
    const { status, email } = req.query;
    let reclamacoesFiltradas = [...reclamacoes];

    // Filtro por status
    if (status) {
      reclamacoesFiltradas = reclamacoesFiltradas.filter(r => r.status === status);
    }

    // Filtro por email
    if (email) {
      reclamacoesFiltradas = reclamacoesFiltradas.filter(r => r.email === email);
    }

    res.json({
      total: reclamacoesFiltradas.length,
      reclamacoes: reclamacoesFiltradas
    });
  } catch (error) {
    console.error('Erro ao listar reclamações:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível listar as reclamações'
    });
  }
};

/**
 * Busca uma reclamação por ID
 */
const buscarReclamacao = (req, res) => {
  try {
    const { id } = req.params;
    const reclamacao = reclamacoes.find(r => r.id === parseInt(id));

    if (!reclamacao) {
      return res.status(404).json({
        error: 'Reclamação não encontrada',
        message: `Reclamação com ID ${id} não foi encontrada`
      });
    }

    res.json(reclamacao);
  } catch (error) {
    console.error('Erro ao buscar reclamação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar a reclamação'
    });
  }
};

/**
 * Atualiza o status de uma reclamação
 */
const atualizarStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['aberta', 'em_analise', 'resolvida', 'cancelada'];
    
    if (!status || !statusValidos.includes(status)) {
      return res.status(400).json({
        error: 'Status inválido',
        message: `Status deve ser um dos seguintes: ${statusValidos.join(', ')}`
      });
    }

    const reclamacao = reclamacoes.find(r => r.id === parseInt(id));

    if (!reclamacao) {
      return res.status(404).json({
        error: 'Reclamação não encontrada',
        message: `Reclamação com ID ${id} não foi encontrada`
      });
    }

    reclamacao.status = status;
    reclamacao.dataAtualizacao = new Date().toISOString();

    res.json({
      message: 'Status atualizado com sucesso',
      reclamacao
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o status'
    });
  }
};

module.exports = {
  criarReclamacao,
  listarReclamacoes,
  buscarReclamacao,
  atualizarStatus
};

