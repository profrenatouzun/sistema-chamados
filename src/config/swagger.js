const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sistema de Chamados API',
      version: '1.0.0',
      description: 'API REST para sistema de chamados desenvolvida para curso de chatbot',
      contact: {
        name: 'Suporte',
        email: 'suporte@exemplo.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    tags: [
      {
        name: 'Verificação',
        description: 'Endpoints para verificação de serviço por CEP'
      },
      {
        name: 'Reclamações',
        description: 'Endpoints para gerenciamento de reclamações'
      },
      {
        name: 'Autenticação',
        description: 'Endpoints para autenticação e alteração de senha'
      },
      {
        name: 'Boletos',
        description: 'Endpoints para gerenciamento de boletos'
      },
      {
        name: 'Chamados',
        description: 'Endpoints para gerenciamento de chamados'
      }
    ],
    components: {
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Tipo do erro'
            },
            message: {
              type: 'string',
              description: 'Mensagem de erro'
            }
          }
        },
        VerificacaoCEP: {
          type: 'object',
          required: ['cep'],
          properties: {
            cep: {
              type: 'string',
              description: 'CEP para verificação (formato: 01310-100 ou 01310100)',
              example: '01310-100'
            }
          }
        },
        VerificacaoCEPResponse: {
          type: 'object',
          properties: {
            cep: {
              type: 'string',
              example: '01310100'
            },
            endereco: {
              type: 'object',
              properties: {
                logradouro: { type: 'string', example: 'Avenida Paulista' },
                bairro: { type: 'string', example: 'Bela Vista' },
                cidade: { type: 'string', example: 'São Paulo' },
                uf: { type: 'string', example: 'SP' }
              }
            },
            servicoDisponivel: {
              type: 'boolean',
              example: true
            },
            mensagem: {
              type: 'string',
              example: 'Serviço disponível na região de São Paulo - SP'
            }
          }
        },
        Reclamacao: {
          type: 'object',
          required: ['nome', 'email', 'assunto', 'descricao'],
          properties: {
            nome: {
              type: 'string',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@exemplo.com'
            },
            telefone: {
              type: 'string',
              example: '(11) 99999-9999'
            },
            assunto: {
              type: 'string',
              example: 'Problema com serviço'
            },
            descricao: {
              type: 'string',
              example: 'Descrição detalhada da reclamação'
            },
            cep: {
              type: 'string',
              example: '01310-100'
            }
          }
        },
        ReclamacaoResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@exemplo.com' },
            telefone: { type: 'string', example: '(11) 99999-9999' },
            assunto: { type: 'string', example: 'Problema com serviço' },
            descricao: { type: 'string', example: 'Descrição detalhada' },
            cep: { type: 'string', example: '01310-100' },
            status: { type: 'string', enum: ['aberta', 'em_analise', 'resolvida', 'cancelada'], example: 'aberta' },
            dataCriacao: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        AlterarSenha: {
          type: 'object',
          required: ['email', 'senhaAtual', 'novaSenha', 'confirmarSenha'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'usuario@exemplo.com'
            },
            senhaAtual: {
              type: 'string',
              example: 'senha123'
            },
            novaSenha: {
              type: 'string',
              minLength: 6,
              example: 'novaSenha456'
            },
            confirmarSenha: {
              type: 'string',
              example: 'novaSenha456'
            }
          }
        },
        Login: {
          type: 'object',
          required: ['email', 'senha'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@exemplo.com'
            },
            senha: {
              type: 'string',
              example: 'senha123'
            }
          }
        },
        ResetSenha: {
          type: 'object',
          required: ['email'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário que deseja resetar a senha',
              example: 'usuario@exemplo.com'
            }
          }
        },
        SegundaViaBoleto: {
          type: 'object',
          required: ['cpf', 'data'],
          properties: {
            cpf: {
              type: 'string',
              description: 'CPF do cliente (formato: 123.456.789-00 ou 12345678900)',
              example: '123.456.789-00'
            },
            data: {
              type: 'string',
              format: 'date',
              description: 'Data do boleto (formato: YYYY-MM-DD)',
              example: '2024-02-15'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email para envio (opcional)',
              example: 'joao@exemplo.com'
            }
          }
        },
        Chamado: {
          type: 'object',
          required: ['nome', 'email', 'categoria', 'assunto', 'descricao'],
          properties: {
            nome: {
              type: 'string',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@exemplo.com'
            },
            telefone: {
              type: 'string',
              example: '(11) 99999-9999'
            },
            categoria: {
              type: 'string',
              enum: ['tecnico', 'financeiro', 'comercial', 'suporte', 'outros'],
              example: 'tecnico'
            },
            assunto: {
              type: 'string',
              example: 'Problema técnico'
            },
            descricao: {
              type: 'string',
              example: 'Descrição detalhada do problema'
            },
            prioridade: {
              type: 'string',
              enum: ['baixa', 'media', 'alta', 'urgente'],
              example: 'alta'
            }
          }
        },
        ChamadoResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            numero: { type: 'string', example: 'CHM-000001' },
            nome: { type: 'string', example: 'João Silva' },
            email: { type: 'string', example: 'joao@exemplo.com' },
            telefone: { type: 'string', example: '(11) 99999-9999' },
            categoria: { type: 'string', example: 'tecnico' },
            assunto: { type: 'string', example: 'Problema técnico' },
            descricao: { type: 'string', example: 'Descrição detalhada' },
            prioridade: { type: 'string', example: 'alta' },
            status: { type: 'string', enum: ['aberto', 'em_andamento', 'aguardando_cliente', 'resolvido', 'fechado'], example: 'aberto' },
            mensagens: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer' },
                  autor: { type: 'string' },
                  email: { type: 'string' },
                  mensagem: { type: 'string' },
                  tipo: { type: 'string' },
                  data: { type: 'string', format: 'date-time' }
                }
              }
            },
            dataAbertura: { type: 'string', format: 'date-time' },
            dataAtualizacao: { type: 'string', format: 'date-time' }
          }
        },
        AtualizarStatus: {
          type: 'object',
          required: ['status'],
          properties: {
            status: {
              type: 'string',
              description: 'Novo status'
            }
          }
        },
        MensagemChamado: {
          type: 'object',
          required: ['mensagem'],
          properties: {
            nome: {
              type: 'string',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'joao@exemplo.com'
            },
            mensagem: {
              type: 'string',
              example: 'Nova mensagem sobre o chamado'
            },
            tipo: {
              type: 'string',
              enum: ['cliente', 'atendente'],
              example: 'cliente'
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/server.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

