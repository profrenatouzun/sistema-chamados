// Armazenamento em memória (simulado - em produção usar banco de dados)
let chamados = [];
let proximoId = 1;

/**
 * Abre um novo chamado
 */
const abrirChamado = (req, res) => {
  try {
    const { nome, email, telefone, categoria, assunto, descricao, prioridade } = req.body;

    // Validações
    if (!nome || !email || !categoria || !assunto || !descricao) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando',
        message: 'Nome, email, categoria, assunto e descrição são obrigatórios'
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

    // Categorias válidas
    const categoriasValidas = ['tecnico', 'financeiro', 'comercial', 'suporte', 'outros'];
    if (!categoriasValidas.includes(categoria)) {
      return res.status(400).json({
        error: 'Categoria inválida',
        message: `Categoria deve ser uma das seguintes: ${categoriasValidas.join(', ')}`
      });
    }

    // Prioridades válidas
    const prioridadesValidas = ['baixa', 'media', 'alta', 'urgente'];
    const prioridadeFinal = prioridade && prioridadesValidas.includes(prioridade) 
      ? prioridade 
      : 'media';

    const novoChamado = {
      id: proximoId++,
      numero: `CHM-${String(proximoId - 1).padStart(6, '0')}`,
      nome,
      email,
      telefone: telefone || null,
      categoria,
      assunto,
      descricao,
      prioridade: prioridadeFinal,
      status: 'aberto',
      mensagens: [
        {
          id: 1,
          autor: nome,
          email: email,
          mensagem: descricao,
          tipo: 'cliente',
          data: new Date().toISOString()
        }
      ],
      dataAbertura: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    chamados.push(novoChamado);

    res.status(201).json({
      message: 'Chamado aberto com sucesso',
      chamado: novoChamado
    });
  } catch (error) {
    console.error('Erro ao abrir chamado:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível abrir o chamado'
    });
  }
};

/**
 * Lista todos os chamados
 */
const listarChamados = (req, res) => {
  try {
    const { status, categoria, email, prioridade } = req.query;
    let chamadosFiltrados = [...chamados];

    // Filtro por status
    if (status) {
      chamadosFiltrados = chamadosFiltrados.filter(c => c.status === status);
    }

    // Filtro por categoria
    if (categoria) {
      chamadosFiltrados = chamadosFiltrados.filter(c => c.categoria === categoria);
    }

    // Filtro por email
    if (email) {
      chamadosFiltrados = chamadosFiltrados.filter(c => c.email === email);
    }

    // Filtro por prioridade
    if (prioridade) {
      chamadosFiltrados = chamadosFiltrados.filter(c => c.prioridade === prioridade);
    }

    res.json({
      total: chamadosFiltrados.length,
      chamados: chamadosFiltrados
    });
  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível listar os chamados'
    });
  }
};

/**
 * Busca um chamado por ID
 */
const buscarChamado = (req, res) => {
  try {
    const { id } = req.params;
    const chamado = chamados.find(c => c.id === parseInt(id) || c.numero === id);

    if (!chamado) {
      return res.status(404).json({
        error: 'Chamado não encontrado',
        message: `Chamado com ID ${id} não foi encontrado`
      });
    }

    res.json(chamado);
  } catch (error) {
    console.error('Erro ao buscar chamado:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar o chamado'
    });
  }
};

/**
 * Atualiza o status de um chamado
 */
const atualizarStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const statusValidos = ['aberto', 'em_andamento', 'aguardando_cliente', 'resolvido', 'fechado'];
    
    if (!status || !statusValidos.includes(status)) {
      return res.status(400).json({
        error: 'Status inválido',
        message: `Status deve ser um dos seguintes: ${statusValidos.join(', ')}`
      });
    }

    const chamado = chamados.find(c => c.id === parseInt(id) || c.numero === id);

    if (!chamado) {
      return res.status(404).json({
        error: 'Chamado não encontrado',
        message: `Chamado com ID ${id} não foi encontrado`
      });
    }

    chamado.status = status;
    chamado.dataAtualizacao = new Date().toISOString();

    res.json({
      message: 'Status atualizado com sucesso',
      chamado
    });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível atualizar o status'
    });
  }
};

/**
 * Adiciona uma mensagem a um chamado
 */
const adicionarMensagem = (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, mensagem, tipo } = req.body;

    if (!mensagem) {
      return res.status(400).json({
        error: 'Mensagem obrigatória',
        message: 'Por favor, informe a mensagem'
      });
    }

    const chamado = chamados.find(c => c.id === parseInt(id) || c.numero === id);

    if (!chamado) {
      return res.status(404).json({
        error: 'Chamado não encontrado',
        message: `Chamado com ID ${id} não foi encontrado`
      });
    }

    const novaMensagem = {
      id: chamado.mensagens.length + 1,
      autor: nome || chamado.nome,
      email: email || chamado.email,
      mensagem,
      tipo: tipo || 'cliente',
      data: new Date().toISOString()
    };

    chamado.mensagens.push(novaMensagem);
    chamado.dataAtualizacao = new Date().toISOString();

    res.json({
      message: 'Mensagem adicionada com sucesso',
      mensagem: novaMensagem,
      chamado
    });
  } catch (error) {
    console.error('Erro ao adicionar mensagem:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível adicionar a mensagem'
    });
  }
};

module.exports = {
  abrirChamado,
  listarChamados,
  buscarChamado,
  atualizarStatus,
  adicionarMensagem
};

