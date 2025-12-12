const fs = require('fs');
const path = require('path');

// Caminho do arquivo CSV
const CSV_PATH = path.join(__dirname, '../../data/reclamacoes.csv');

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
 * Lê as reclamações do arquivo CSV
 */
const lerReclamacoes = () => {
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
      return {
        id: parseInt(campos[0]) || 0,
        nome: campos[1] || '',
        email: campos[2] || '',
        telefone: campos[3] || null,
        assunto: campos[4] || '',
        descricao: campos[5] || '',
        cep: campos[6] || null,
        status: campos[7] || 'aberta',
        dataCriacao: campos[8] || new Date().toISOString(),
        dataAtualizacao: campos[9] || new Date().toISOString()
      };
    }).filter(r => r.id > 0);

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
  const reclamacoes = lerReclamacoes();
  if (reclamacoes.length === 0) return 1;
  return Math.max(...reclamacoes.map(r => r.id)) + 1;
};

/**
 * Salva as reclamações no arquivo CSV
 */
const salvarReclamacoes = (reclamacoes) => {
  try {
    const cabecalho = 'id,nome,email,telefone,assunto,descricao,cep,status,dataCriacao,dataAtualizacao\n';
    const linhas = reclamacoes.map(r => 
      `${r.id},${escapeCSV(r.nome)},${escapeCSV(r.email)},${escapeCSV(r.telefone)},${escapeCSV(r.assunto)},${escapeCSV(r.descricao)},${escapeCSV(r.cep)},${escapeCSV(r.status)},${escapeCSV(r.dataCriacao)},${escapeCSV(r.dataAtualizacao)}`
    ).join('\n');
    const conteudo = cabecalho + linhas;
    
    fs.writeFileSync(CSV_PATH, conteudo, 'utf-8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo CSV:', error);
    return false;
  }
};

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

    // Lê reclamações existentes
    const reclamacoes = lerReclamacoes();
    const proximoId = obterProximoId();

    const novaReclamacao = {
      id: proximoId,
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

    // Salva no CSV
    if (!salvarReclamacoes(reclamacoes)) {
      return res.status(500).json({
        error: 'Erro ao salvar',
        message: 'Não foi possível salvar a reclamação'
      });
    }

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
    let reclamacoes = lerReclamacoes();

    // Filtro por status
    if (status) {
      reclamacoes = reclamacoes.filter(r => r.status === status);
    }

    // Filtro por email
    if (email) {
      reclamacoes = reclamacoes.filter(r => r.email === email);
    }

    res.json({
      total: reclamacoes.length,
      reclamacoes: reclamacoes
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
    const reclamacoes = lerReclamacoes();
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

    const reclamacoes = lerReclamacoes();
    const reclamacao = reclamacoes.find(r => r.id === parseInt(id));

    if (!reclamacao) {
      return res.status(404).json({
        error: 'Reclamação não encontrada',
        message: `Reclamação com ID ${id} não foi encontrada`
      });
    }

    reclamacao.status = status;
    reclamacao.dataAtualizacao = new Date().toISOString();

    // Salva no CSV
    if (!salvarReclamacoes(reclamacoes)) {
      return res.status(500).json({
        error: 'Erro ao salvar',
        message: 'Não foi possível salvar a alteração'
      });
    }

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
