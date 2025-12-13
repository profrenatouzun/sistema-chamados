# Guia de Integração com Dialogflow

Este documento explica como integrar o Sistema de Chamados com o Google Dialogflow para criar um chatbot inteligente.

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Pré-requisitos](#pré-requisitos)
3. [Configuração do Webhook](#configuração-do-webhook)
4. [Criação de Intenções](#criação-de-intenções)
5. [Configuração de Parâmetros](#configuração-de-parâmetros)
6. [Exemplos de Intenções](#exemplos-de-intenções)
7. [Testando a Integração](#testando-a-integração)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

O sistema fornece um endpoint webhook (`/api/dialogflow/webhook`) que processa requisições do Dialogflow e retorna respostas formatadas. As seguintes funcionalidades estão disponíveis:

- ✅ **Consultar CEP** - Verifica se o serviço está disponível em um CEP
- ✅ **Abrir Chamado** - Cria um novo chamado de suporte
- ✅ **Abrir Reclamação** - Registra uma nova reclamação
- ✅ **Reset de Senha** - Gera uma nova senha automaticamente
- ✅ **Segunda Via de Boleto** - Gera segunda via de boleto

---

## 📦 Pré-requisitos

1. **Sistema de Chamados rodando**
   - Servidor deve estar acessível publicamente (ou via ngrok para testes)
   - Endpoint: `http://seu-servidor:3000/api/dialogflow/webhook`

2. **Conta no Google Dialogflow**
   - Acesse: https://dialogflow.cloud.google.com/
   - Crie um novo agente ou use um existente

3. **URL pública do servidor**
   - Para desenvolvimento: use ngrok ou similar
   - Para produção: configure um domínio válido

---

## 🔧 Configuração do Webhook

### Passo 1: Acessar Configurações do Agente

1. No console do Dialogflow, selecione seu agente
2. Vá em **Settings** (⚙️) no menu lateral
3. Clique em **General**
4. Role até a seção **Google Cloud Project**

### Passo 2: Configurar Fulfillment

1. No menu lateral, clique em **Fulfillment**
2. Ative a opção **Webhook**
3. Cole a URL do seu webhook:
   ```
   http://seu-servidor:3000/api/dialogflow/webhook
   ```
   ou para produção:
   ```
   https://seu-dominio.com/api/dialogflow/webhook
   ```

4. Clique em **Save**

### Passo 3: Configurar Autenticação (Opcional)

Para produção, recomenda-se configurar autenticação:
- Use Basic Auth ou OAuth
- Configure no servidor Express se necessário

---

## 🎭 Criação de Intenções

### Estrutura de uma Intenção

Cada funcionalidade requer uma intenção no Dialogflow. Vamos criar cada uma:

---

## 📝 Exemplos de Intenções

### 1. Consultar CEP

**Nome da Intenção:** `consultar_cep` ou `verificar_cep`

**Exemplos de Frases de Treinamento:**
```
- Quero consultar o CEP 01310100
- Verificar se atendem no CEP 01310-100
- Consultar CEP 01310100
- Verificar CEP 01310-100
- Vocês atendem no CEP 01310100?
- O serviço está disponível no CEP 01310-100?
```

**Parâmetros:**
- `cep` (obrigatório)
  - Tipo: `@sys.number-sequence` ou `@sys.any`
  - Entity: Crie uma entidade personalizada se necessário
  - Prompt: "Qual CEP você gostaria de consultar?"

**Ação:** Habilitar webhook para esta intenção

---

### 2. Abrir Chamado

**Nome da Intenção:** `abrir_chamado` ou `criar_chamado`

**Exemplos de Frases de Treinamento:**
```
- Quero abrir um chamado
- Preciso criar um chamado técnico
- Abrir chamado sobre problema de internet
- Criar chamado de suporte
- Quero registrar um chamado
```

**Parâmetros:**
- `nome` (opcional)
  - Tipo: `@sys.person` ou `@sys.any`
  - Prompt: "Qual é o seu nome?"
  
- `email` (obrigatório)
  - Tipo: `@sys.email` ou `@sys.any`
  - Prompt: "Qual é o seu email?"
  
- `telefone` (opcional)
  - Tipo: `@sys.phone-number` ou `@sys.any`
  - Prompt: "Qual é o seu telefone?"
  
- `categoria` (opcional, padrão: "outros")
  - Tipo: Entidade personalizada
  - Valores: `tecnico`, `financeiro`, `comercial`, `suporte`, `outros`
  - Prompt: "Qual a categoria do chamado?"
  
- `assunto` (obrigatório)
  - Tipo: `@sys.any`
  - Prompt: "Qual é o assunto do chamado?"
  
- `descricao` (obrigatório)
  - Tipo: `@sys.any`
  - Prompt: "Descreva o problema detalhadamente"
  
- `prioridade` (opcional, padrão: "media")
  - Tipo: Entidade personalizada
  - Valores: `baixa`, `media`, `alta`, `urgente`
  - Prompt: "Qual a prioridade?"

**Ação:** Habilitar webhook para esta intenção

---

### 3. Abrir Reclamação

**Nome da Intenção:** `abrir_reclamacao` ou `criar_reclamacao`

**Exemplos de Frases de Treinamento:**
```
- Quero fazer uma reclamação
- Preciso reclamar sobre o atendimento
- Abrir reclamação sobre o serviço
- Registrar uma reclamação
- Quero reclamar
```

**Parâmetros:**
- `nome` (opcional)
  - Tipo: `@sys.person` ou `@sys.any`
  - Prompt: "Qual é o seu nome?"
  
- `email` (obrigatório)
  - Tipo: `@sys.email` ou `@sys.any`
  - Prompt: "Qual é o seu email?"
  
- `telefone` (opcional)
  - Tipo: `@sys.phone-number` ou `@sys.any`
  - Prompt: "Qual é o seu telefone?"
  
- `assunto` (obrigatório)
  - Tipo: `@sys.any`
  - Prompt: "Qual é o assunto da reclamação?"
  
- `descricao` (obrigatório)
  - Tipo: `@sys.any`
  - Prompt: "Descreva sua reclamação detalhadamente"
  
- `cep` (opcional)
  - Tipo: `@sys.number-sequence` ou `@sys.any`
  - Prompt: "Qual é o seu CEP?"

**Ação:** Habilitar webhook para esta intenção

---

### 4. Reset de Senha

**Nome da Intenção:** `reset_senha`, `redefinir_senha` ou `esqueci_senha`

**Exemplos de Frases de Treinamento:**
```
- Esqueci minha senha
- Quero redefinir minha senha
- Resetar senha
- Preciso resetar minha senha
- Esqueci a senha
- Redefinir senha
```

**Parâmetros:**
- `email` (obrigatório)
  - Tipo: `@sys.email` ou `@sys.any`
  - Prompt: "Qual é o seu email cadastrado?"

**Ação:** Habilitar webhook para esta intenção

---

### 5. Segunda Via de Boleto

**Nome da Intenção:** `segunda_via_boleto` ou `gerar_segunda_via`

**Exemplos de Frases de Treinamento:**
```
- Quero gerar segunda via do boleto
- Preciso da segunda via do boleto
- Gerar segunda via
- Emitir segunda via do boleto
- Quero a segunda via
```

**Parâmetros:**
- `cpf` (obrigatório)
  - Tipo: `@sys.number-sequence` ou `@sys.any`
  - Prompt: "Qual é o seu CPF?"
  
- `data` (obrigatório)
  - Tipo: `@sys.date` ou `@sys.date-time`
  - Prompt: "Qual é a data de vencimento do boleto? (formato: YYYY-MM-DD)"
  
- `email` (opcional)
  - Tipo: `@sys.email` ou `@sys.any`
  - Prompt: "Para qual email enviar? (opcional)"

**Ação:** Habilitar webhook para esta intenção

---

## 🔄 Configuração de Parâmetros

### Criando Entidades Personalizadas

Para melhor reconhecimento, crie entidades personalizadas:

#### Entidade: `categoria_chamado`
Valores:
- `tecnico` (sinônimos: técnico, problema técnico, suporte técnico)
- `financeiro` (sinônimos: financeiro, pagamento, cobrança)
- `comercial` (sinônimos: comercial, vendas, contrato)
- `suporte` (sinônimos: suporte, ajuda, assistência)
- `outros` (sinônimos: outros, geral, outro)

#### Entidade: `prioridade`
Valores:
- `baixa` (sinônimos: baixa, normal, comum)
- `media` (sinônimos: média, normal, padrão)
- `alta` (sinônimos: alta, importante, urgente)
- `urgente` (sinônimos: urgente, emergência, crítico)

---

## 🧪 Testando a Integração

### 1. Teste via Console do Dialogflow

1. No console do Dialogflow, vá em **Try it now**
2. Digite uma frase de teste, por exemplo:
   ```
   Quero consultar o CEP 01310100
   ```
3. Verifique se:
   - A intenção foi reconhecida corretamente
   - Os parâmetros foram extraídos
   - A resposta do webhook foi retornada

### 2. Teste via API Direta

Use o arquivo `exemplos-requisicoes.http` ou faça uma requisição direta:

```bash
curl -X POST http://localhost:3000/api/dialogflow/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "queryResult": {
      "intent": {
        "displayName": "consultar_cep"
      },
      "parameters": {
        "cep": "01310100"
      }
    }
  }'
```

### 3. Teste em Produção

1. Configure o webhook com a URL de produção
2. Teste através do console do Dialogflow
3. Integre com seu canal preferido (WhatsApp, Telegram, etc.)

---

## 📱 Integração com Canais

### WhatsApp (via Twilio ou similar)

1. Configure o canal no Dialogflow
2. Conecte ao seu número do WhatsApp
3. O webhook será chamado automaticamente

### Telegram

1. Crie um bot no Telegram via @BotFather
2. Configure o webhook do Telegram para o Dialogflow
3. Conecte o Dialogflow ao seu bot

### Site/App

1. Use o SDK do Dialogflow
2. Configure o agente
3. As requisições serão processadas automaticamente

---

## 🐛 Troubleshooting

### Problema: Webhook não está sendo chamado

**Soluções:**
1. Verifique se o webhook está habilitado na intenção
2. Confirme que a URL está correta e acessível
3. Verifique os logs do servidor
4. Teste a URL diretamente com curl/Postman

### Problema: Parâmetros não estão sendo extraídos

**Soluções:**
1. Adicione mais exemplos de treinamento
2. Verifique se os parâmetros estão marcados como obrigatórios
3. Configure prompts para coletar parâmetros faltantes
4. Use entidades personalizadas para melhor reconhecimento

### Problema: Resposta não está formatada corretamente

**Soluções:**
1. Verifique o formato da resposta no console do Dialogflow
2. Confirme que o webhook está retornando `fulfillmentText`
3. Verifique os logs do servidor para erros

### Problema: Erro 404 ou 500

**Soluções:**
1. Verifique se o servidor está rodando
2. Confirme que a rota `/api/dialogflow/webhook` existe
3. Verifique os logs do servidor para detalhes do erro
4. Teste o endpoint diretamente

---

## 📊 Formato de Requisição e Resposta

### Requisição do Dialogflow

```json
{
  "queryResult": {
    "intent": {
      "displayName": "consultar_cep",
      "displayName": "consultar_cep"
    },
    "parameters": {
      "cep": "01310100"
    },
    "queryText": "Quero consultar o CEP 01310100"
  }
}
```

### Resposta Esperada

```json
{
  "fulfillmentText": "✅ Verificação realizada com sucesso!\n\nCEP: 01310100\n...",
  "fulfillmentMessages": [
    {
      "text": {
        "text": ["✅ Verificação realizada com sucesso!\n\nCEP: 01310100\n..."]
      }
    }
  ]
}
```

---

## 🔐 Segurança

### Recomendações

1. **Use HTTPS em produção**
   - Configure SSL/TLS no servidor
   - Use certificado válido

2. **Autenticação**
   - Configure autenticação no webhook se necessário
   - Use tokens ou API keys

3. **Validação**
   - Valide todos os parâmetros recebidos
   - Sanitize dados de entrada

4. **Rate Limiting**
   - Implemente limite de requisições
   - Proteja contra abuso

---

## 📚 Recursos Adicionais

- [Documentação do Dialogflow](https://cloud.google.com/dialogflow/docs)
- [API do Sistema de Chamados](./README.md)
- [Exemplos de Requisições](./exemplos-requisicoes.http)
- [Swagger Documentation](http://localhost:3000/api-docs)

---

## 💡 Dicas

1. **Teste cada intenção individualmente** antes de integrar todas
2. **Use o console do Dialogflow** para debugar problemas
3. **Adicione muitos exemplos de treinamento** para melhor reconhecimento
4. **Configure prompts claros** para coletar parâmetros
5. **Monitore os logs** do servidor para identificar problemas

---

## 🆘 Suporte

Em caso de dúvidas ou problemas:
1. Verifique os logs do servidor
2. Consulte a documentação da API
3. Teste os endpoints diretamente
4. Verifique a configuração do Dialogflow

---

**Última atualização:** Dezembro 2024

