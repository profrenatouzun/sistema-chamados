# Sistema de Chamados - API REST

Sistema desenvolvido em Node.js com API REST para uso em curso de chatbot. O sistema oferece funcionalidades para verificação de serviços, reclamações, autenticação, boletos e gerenciamento de chamados.

## 🚀 Funcionalidades

- ✅ **Verificação de Serviço por CEP**: Verifica se o serviço está disponível na região do CEP informado
- ✅ **Sistema de Reclamações**: Criar, listar e gerenciar reclamações
- ✅ **Alteração de Senha**: Permite alterar a senha do usuário
- ✅ **Segunda Via de Boleto**: Solicita e gera segunda via de boletos
- ✅ **Sistema de Chamados**: Abrir, listar, buscar e gerenciar chamados com mensagens

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório ou navegue até o diretório do projeto:
```bash
cd sistema-chamados
```

2. Instale as dependências:
```bash
npm install
```

3. (Opcional) Configure variáveis de ambiente criando um arquivo `.env`:
```
PORT=3000
NODE_ENV=development
```

## 🏃 Executando o Projeto

### Modo Desenvolvimento (com nodemon):
```bash
npm run dev
```

### Modo Produção:
```bash
npm start
```

O servidor estará rodando em `http://localhost:3000`

## 🌐 Interface Web

O sistema possui uma interface web completa para visualização e administração:

**Acesse:** `http://localhost:3000`

### Páginas Disponíveis:

- **Dashboard** (`/`) - Visão geral com estatísticas e ações rápidas
- **Chamados** (`/chamados`) - Gerenciar chamados (criar, visualizar, atualizar status, adicionar mensagens)
- **Reclamações** (`/reclamacoes`) - Gerenciar reclamações (criar, visualizar, atualizar status)
- **Boletos** (`/boletos`) - Solicitar segunda via de boleto
- **Verificação CEP** (`/verificacao`) - Verificar disponibilidade de serviço por CEP

### Funcionalidades da Interface:

✅ **Dashboard interativo** com estatísticas em tempo real  
✅ **Criação de chamados e reclamações** através de formulários  
✅ **Visualização detalhada** de cada item com modal  
✅ **Atualização de status** diretamente pela interface  
✅ **Filtros** por status, categoria, email, etc.  
✅ **Adição de mensagens** aos chamados  
✅ **Design responsivo** e moderno  
✅ **Notificações** de sucesso/erro  

## 📚 Documentação da API

### Swagger UI

A documentação interativa da API está disponível através do Swagger UI:

**Acesse:** `http://localhost:3000/api-docs`

O Swagger UI permite:
- Visualizar todos os endpoints disponíveis
- Ver exemplos de requisições e respostas
- Testar os endpoints diretamente pela interface
- Ver os schemas de dados utilizados

## 📖 Endpoints da API

### Health Check
```
GET /health
```
Retorna o status do sistema.

### 1. Verificação de Serviço por CEP

#### Verificar CEP (POST)
```
POST /api/verificacao/cep
Content-Type: application/json

{
  "cep": "01310-100"
}
```

#### Verificar CEP (GET)
```
GET /api/verificacao/cep/:cep
```

**Resposta:**
```json
{
  "cep": "01310100",
  "endereco": {
    "logradouro": "Avenida Paulista",
    "bairro": "Bela Vista",
    "cidade": "São Paulo",
    "uf": "SP"
  },
  "servicoDisponivel": true,
  "mensagem": "Serviço disponível na região de São Paulo - SP"
}
```

### 2. Sistema de Reclamações

#### Criar Reclamação
```
POST /api/reclamacoes
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "(11) 99999-9999",
  "assunto": "Problema com serviço",
  "descricao": "Descrição detalhada da reclamação",
  "cep": "01310-100"
}
```

#### Listar Reclamações
```
GET /api/reclamacoes
GET /api/reclamacoes?status=aberta
GET /api/reclamacoes?email=joao@exemplo.com
```

#### Buscar Reclamação
```
GET /api/reclamacoes/:id
```

#### Atualizar Status
```
PUT /api/reclamacoes/:id/status
Content-Type: application/json

{
  "status": "resolvida"
}
```

**Status válidos:** `aberta`, `em_analise`, `resolvida`, `cancelada`

### 3. Autenticação

#### Alterar Senha
```
POST /api/auth/alterar-senha
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "senhaAtual": "senha123",
  "novaSenha": "novaSenha456",
  "confirmarSenha": "novaSenha456"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@exemplo.com",
  "senha": "senha123"
}
```

### 4. Boletos

#### Solicitar Segunda Via
```
POST /api/boletos/segunda-via
Content-Type: application/json

{
  "codigo": "BOL001",
  "email": "joao@exemplo.com",
  "cpf": "123.456.789-00"
}
```

#### Buscar Boleto
```
GET /api/boletos/:codigo
```

### 5. Sistema de Chamados

#### Abrir Chamado
```
POST /api/chamados
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "telefone": "(11) 99999-9999",
  "categoria": "tecnico",
  "assunto": "Problema técnico",
  "descricao": "Descrição detalhada do problema",
  "prioridade": "alta"
}
```

**Categorias válidas:** `tecnico`, `financeiro`, `comercial`, `suporte`, `outros`  
**Prioridades válidas:** `baixa`, `media`, `alta`, `urgente`

#### Listar Chamados
```
GET /api/chamados
GET /api/chamados?status=aberto
GET /api/chamados?categoria=tecnico
GET /api/chamados?email=joao@exemplo.com
GET /api/chamados?prioridade=alta
```

#### Buscar Chamado
```
GET /api/chamados/:id
```

#### Atualizar Status
```
PUT /api/chamados/:id/status
Content-Type: application/json

{
  "status": "em_andamento"
}
```

**Status válidos:** `aberto`, `em_andamento`, `aguardando_cliente`, `resolvido`, `fechado`

#### Adicionar Mensagem
```
POST /api/chamados/:id/mensagens
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "mensagem": "Nova mensagem sobre o chamado",
  "tipo": "cliente"
}
```

## 🧪 Exemplos de Uso

### Exemplo com cURL

```bash
# Verificar CEP
curl -X POST http://localhost:3000/api/verificacao/cep \
  -H "Content-Type: application/json" \
  -d '{"cep": "01310-100"}'

# Abrir Chamado
curl -X POST http://localhost:3000/api/chamados \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "categoria": "tecnico",
    "assunto": "Problema técnico",
    "descricao": "Descrição do problema"
  }'

# Solicitar Segunda Via de Boleto
curl -X POST http://localhost:3000/api/boletos/segunda-via \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": "BOL001",
    "email": "joao@exemplo.com"
  }'
```

## 📁 Estrutura do Projeto

```
sistema-chamados/
├── src/
│   ├── config/
│   │   └── swagger.js          # Configuração do Swagger
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── boletosController.js
│   │   ├── chamadosController.js
│   │   ├── reclamacoesController.js
│   │   └── verificacaoController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── boletos.js
│   │   ├── chamados.js
│   │   ├── reclamacoes.js
│   │   ├── verificacao.js
│   │   └── web.js              # Rotas das páginas web
│   └── server.js
├── public/                     # Arquivos estáticos (HTML, CSS, JS)
│   ├── index.html              # Dashboard
│   ├── chamados.html           # Página de chamados
│   ├── reclamacoes.html        # Página de reclamações
│   ├── boletos.html            # Página de boletos
│   ├── verificacao.html        # Página de verificação CEP
│   ├── styles.css              # Estilos CSS
│   ├── app.js                  # JavaScript comum
│   ├── chamados.js             # JavaScript de chamados
│   └── reclamacoes.js          # JavaScript de reclamações
├── .gitignore
├── package.json
├── exemplos-requisicoes.http
└── README.md
```

## ⚠️ Observações

- Os dados são armazenados em memória (arrays). Em produção, recomenda-se usar um banco de dados (MongoDB, PostgreSQL, etc.)
- As senhas não estão criptografadas. Em produção, use bibliotecas como `bcrypt` para hash de senhas
- A API de CEP utiliza a API pública ViaCEP
- Para produção, implemente autenticação JWT e validações mais robustas

## 🔒 Segurança

Para uso em produção, considere implementar:
- Autenticação JWT
- Criptografia de senhas (bcrypt)
- Validação de dados mais robusta
- Rate limiting
- HTTPS
- Banco de dados seguro

## 📝 Licença

Este projeto foi desenvolvido para fins educacionais.

