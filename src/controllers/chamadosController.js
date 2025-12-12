const fs = require('fs');
const path = require('path');

// Caminho do arquivo CSV
const CSV_PATH = path.join(__dirname, '../../data/chamados.csv');

/**
 * Escapa valores CSV (trata vírgulas e quebras de linha)
 */
const escapeCSV = (valor) => {
  if (valor === null || valor === undefined) return '';
  const str = String(valor);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

/**
 * Desescapa valores CSV
 */
const unescapeCSV = (valor) => {
  if (!valor) return null;
  if (valor.startsWith('"') && valor.endsWith('"')) {
    return valor.slice(1, -1).replace(/""/g, '"');
  }
  return valor === '' ? null : valor;
};

/**
 * Lê os chamados do arquivo CSV
 */
const lerChamados = () => {
  try {
    if (!fs.existsSync(CSV_PATH)) {
      return [];
    }

    const conteudo = fs.readFileSync(CSV_PATH, 'utf-8');
    const linhas = conteudo.trim().split('\n');
    
    if (linhas.length <= 1) {
      return [];
    }

    // Remove o cabeçalho
    const dados = linhas.slice(1).map(linha => {
      const campos = linha.split(',').map(campo => unescapeCSV(campo.trim()));
      let mensagens = [];
      try {
        mensagens = campos[10] ? JSON.parse(campos[10]) : [];
      } catch (e) {
        mensagens = [];
      }

      return {
        id: parseInt(campos[0]) || 0,
        numero: campos[1] || '',
        nome: campos[2] || '',
        email: campos[3] || '',
        telefone: campos[4] || null,
        categoria: campos[5] || '',
        assunto: campos[6] || '',
        descricao: campos[7] || '',
        prioridade: campos[8] || 'media',
        status: campos[9] || 'aberto',
        mensagens: mensagens,
        dataAbertura: campos[11] || new Date().toISOString(),
        dataAtualizacao: campos[12] || new Date().toISOString()
      };
    }).filter(c => c.id > 0);

    return dados;
  } catch (error) {
    console.error('Erro ao ler arquivo CSV:', error);
    return [];
  }
};

/**
 * Obtém o próximo ID disponível
 */
const obterProximoId = () => {
  const chamados = lerChamados();
  if (chamados.length === 0) return 1;
  return Math.max(...chamados.map(c => c.id)) + 1;
};

/**
 * Salva os chamados no arquivo CSV
 */
const salvarChamados = (chamados) => {
  try {
    const cabecalho = 'id,numero,nome,email,telefone,categoria,assunto,descricao,prioridade,status,mensagens,dataAbertura,dataAtualizacao\n';
    const linhas = chamados.map(c => {
      const mensagensStr = escapeCSV(JSON.stringify(c.mensagens || []));
      return `${c.id},${escapeCSV(c.numero)},${escapeCSV(c.nome)},${escapeCSV(c.email)},${escapeCSV(c.telefone)},${escapeCSV(c.categoria)},${escapeCSV(c.assunto)},${escapeCSV(c.descricao)},${escapeCSV(c.prioridade)},${escapeCSV(c.status)},${mensagensStr},${escapeCSV(c.dataAbertura)},${escapeCSV(c.dataAtualizacao)}`;
    }).join('\n');
    const conteudo = cabecalho + linhas;
    
    fs.writeFileSync(CSV_PATH, conteudo, 'utf-8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo CSV:', error);
    return false;
  }
};

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

    // Lê chamados existentes
    const chamados = lerChamados();
    const proximoId = obterProximoId();

    const novoChamado = {
      id: proximoId,
      numero: `CHM-${String(proximoId).padStart(6, '0')}`,
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

    // Salva no CSV
    if (!salvarChamados(chamados)) {
      return res.status(500).json({
        error: 'Erro ao salvar',
        message: 'Não foi possível salvar o chamado'
      });
    }

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
    let chamados = lerChamados();

    // Filtro por status
    if (status) {
      chamados = chamados.filter(c => c.status === status);
    }

    // Filtro por categoria
    if (categoria) {
      chamados = chamados.filter(c => c.categoria === categoria);
    }

    // Filtro por email
    if (email) {
      chamados = chamados.filter(c => c.email === email);
    }

    // Filtro por prioridade
    if (prioridade) {
      chamados = chamados.filter(c => c.prioridade === prioridade);
    }

    res.json({
      total: chamados.length,
      chamados: chamados
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
    const chamados = lerChamados();
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

    const chamados = lerChamados();
    const chamado = chamados.find(c => c.id === parseInt(id) || c.numero === id);

    if (!chamado) {
      return res.status(404).json({
        error: 'Chamado não encontrado',
        message: `Chamado com ID ${id} não foi encontrado`
      });
    }

    chamado.status = status;
    chamado.dataAtualizacao = new Date().toISOString();

    // Salva no CSV
    if (!salvarChamados(chamados)) {
      return res.status(500).json({
        error: 'Erro ao salvar',
        message: 'Não foi possível salvar a alteração'
      });
    }

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

    const chamados = lerChamados();
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

    // Salva no CSV
    if (!salvarChamados(chamados)) {
      return res.status(500).json({
        error: 'Erro ao salvar',
        message: 'Não foi possível salvar a mensagem'
      });
    }

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

/**
 * Lista as categorias possíveis de um chamado
 */
const listarCategorias = (req, res) => {
  try {
    const categoriasValidas = ['tecnico', 'financeiro', 'comercial', 'suporte', 'outros'];
    res.json(categoriasValidas);
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível listar as categorias'
    });
  }
};

/**
 * Lista os status possíveis de um chamado
 */
const listarStatus = (req, res) => {
  try {
    const statusValidos = ['aberto', 'em_andamento', 'aguardando_cliente', 'resolvido', 'fechado'];
    res.json(statusValidos);
  } catch (error) {
    console.error('Erro ao listar status:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível listar os status'
    });
  }
};

module.exports = {
  abrirChamado,
  listarChamados,
  buscarChamado,
  atualizarStatus,
  adicionarMensagem,
  listarCategorias,
  listarStatus
};
