// Armazenamento em memória (simulado - em produção usar banco de dados)
let usuarios = [
  {
    id: 1,
    email: 'admin@exemplo.com',
    senha: 'senha123', // Em produção, usar hash (bcrypt)
    nome: 'Administrador'
  }
];

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
        nome: usuario.nome
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

