const fs = require('fs');
const path = require('path');

// Caminho do arquivo CSV
const CSV_PATH = path.join(__dirname, '../../data/usuarios.csv');

/**
 * Lê os usuários do arquivo CSV
 */
const lerUsuarios = () => {
  try {
    if (!fs.existsSync(CSV_PATH)) {
      console.warn('Arquivo CSV não encontrado, criando arquivo padrão...');
      criarArquivoPadrao();
    }

    const conteudo = fs.readFileSync(CSV_PATH, 'utf-8');
    const linhas = conteudo.trim().split('\n');
    
    // Remove o cabeçalho
    const dados = linhas.slice(1).map(linha => {
      const campos = linha.split(',');
      return {
        id: parseInt(campos[0]),
        email: campos[1]?.trim() || '',
        senha: campos[2]?.trim() || '',
        nome: campos[3]?.trim() || '',
        tipo: campos[4]?.trim() || 'user'
      };
    });

    return dados;
  } catch (error) {
    console.error('Erro ao ler arquivo CSV:', error);
    return [];
  }
};

/**
 * Salva os usuários no arquivo CSV
 */
const salvarUsuarios = (usuarios) => {
  try {
    const cabecalho = 'id,email,senha,nome,tipo\n';
    const linhas = usuarios.map(u => `${u.id},${u.email},${u.senha},${u.nome},${u.tipo || 'user'}`).join('\n');
    const conteudo = cabecalho + linhas;
    
    fs.writeFileSync(CSV_PATH, conteudo, 'utf-8');
    return true;
  } catch (error) {
    console.error('Erro ao salvar arquivo CSV:', error);
    return false;
  }
};

/**
 * Cria arquivo CSV padrão se não existir
 */
const criarArquivoPadrao = () => {
  const diretorio = path.dirname(CSV_PATH);
  if (!fs.existsSync(diretorio)) {
    fs.mkdirSync(diretorio, { recursive: true });
  }

  const conteudoPadrao = `id,email,senha,nome,tipo
1,admin@exemplo.com,senha123,Administrador,admin
2,user@exemplo.com,user123,Usuário,user
3,atendente@exemplo.com,atendente123,Atendente,admin
4,suporte@exemplo.com,suporte123,Suporte Técnico,admin
5,gerente@exemplo.com,gerente123,Gerente,admin
`;
  fs.writeFileSync(CSV_PATH, conteudoPadrao, 'utf-8');
};

/**
 * Altera a senha do usuário
 */
const alterarSenha = (req, res) => {
  try {
    const { email, senhaAtual, novaSenha, confirmarSenha } = req.body;

    // Validações
    if (!email || !senhaAtual || !novaSenha || !confirmarSenha) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando',
        message: 'Email, senha atual, nova senha e confirmação são obrigatórios'
      });
    }

    if (novaSenha !== confirmarSenha) {
      return res.status(400).json({
        error: 'Senhas não coincidem',
        message: 'A nova senha e a confirmação devem ser iguais'
      });
    }

    if (novaSenha.length < 6) {
      return res.status(400).json({
        error: 'Senha muito curta',
        message: 'A nova senha deve ter no mínimo 6 caracteres'
      });
    }

    if (senhaAtual === novaSenha) {
      return res.status(400).json({
        error: 'Senha inválida',
        message: 'A nova senha deve ser diferente da senha atual'
      });
    }

    // Lê usuários do CSV
    const usuarios = lerUsuarios();
    
    // Busca o usuário
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario) {
      return res.status(404).json({
        error: 'Usuário não encontrado',
        message: 'Email não cadastrado no sistema'
      });
    }

    // Verifica senha atual
    if (usuario.senha !== senhaAtual) {
      return res.status(401).json({
        error: 'Senha atual incorreta',
        message: 'A senha atual informada está incorreta'
      });
    }

    // Atualiza a senha
    usuario.senha = novaSenha;

    // Salva no CSV
    if (!salvarUsuarios(usuarios)) {
      return res.status(500).json({
        error: 'Erro ao salvar',
        message: 'Não foi possível salvar a alteração'
      });
    }

    res.json({
      message: 'Senha alterada com sucesso',
      email: usuario.email
    });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível alterar a senha'
    });
  }
};

/**
 * Realiza login do usuário
 */
const login = (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        error: 'Campos obrigatórios faltando',
        message: 'Email e senha são obrigatórios'
      });
    }

    // Lê usuários do CSV
    const usuarios = lerUsuarios();
    
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);

    if (!usuario) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: 'Email ou senha incorretos'
      });
    }

    // Em produção, retornar um token JWT
    res.json({
      message: 'Login realizado com sucesso',
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nome: usuario.nome,
        tipo: usuario.tipo || 'user'
      }
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível realizar o login'
    });
  }
};

module.exports = {
  alterarSenha,
  login
};
