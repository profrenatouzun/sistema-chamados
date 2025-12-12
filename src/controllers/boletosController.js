// Armazenamento em memória (simulado - em produção usar banco de dados)
let boletos = [
  {
    codigo: 'BOL001',
    valor: 150.00,
    vencimento: '2024-02-15',
    status: 'pendente',
    cliente: {
      nome: 'João Silva',
      email: 'joao@exemplo.com',
      cpf: '123.456.789-00'
    }
  },
  {
    codigo: 'BOL002',
    valor: 200.00,
    vencimento: '2024-02-20',
    status: 'pago',
    cliente: {
      nome: 'Maria Santos',
      email: 'maria@exemplo.com',
      cpf: '987.654.321-00'
    }
  }
];

/**
 * Gera um código aleatório para o boleto
 */
const gerarCodigoBoleto = () => {
  const prefixo = 'BOL';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${prefixo}-${timestamp}-${random}`;
};

/**
 * Calcula dígito verificador usando módulo 11
 */
const calcularDigitoVerificador = (numero) => {
  let soma = 0;
  let peso = 2;
  
  // Percorre de trás para frente
  for (let i = numero.length - 1; i >= 0; i--) {
    soma += parseInt(numero[i]) * peso;
    peso = peso === 9 ? 2 : peso + 1;
  }
  
  const resto = soma % 11;
  const digito = resto < 2 ? 0 : 11 - resto;
  return digito.toString();
};

/**
 * Gera uma linha digitável de boleto brasileiro (fictícia)
 * Formato: XXXXX.XXXXX XXXXXX.XXXXXX XXXXXX.XXXXXX X XXXXXXXXXXXXXXXXXX
 * Total: 47 dígitos
 */
const gerarLinhaDigitavel = (cpf, valor, dataVencimento) => {
  // Remove caracteres não numéricos do CPF
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  // Gera números aleatórios baseados em timestamp e CPF
  const timestamp = Date.now().toString();
  const valorStr = Math.floor(valor * 100).toString().padStart(10, '0');
  
  // Gera números aleatórios para os campos
  const random1 = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const random2 = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const random3 = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const random4 = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const random5 = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  const random6 = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  
  // Primeiro campo: 5 dígitos + 5 dígitos + dígito verificador
  const campo1Base = (random1 + random2).substring(0, 10);
  const dv1 = calcularDigitoVerificador(campo1Base);
  const campo1Formatado = campo1Base.substring(0, 5) + '.' + campo1Base.substring(5, 10) + dv1;
  
  // Segundo campo: 5 dígitos + 5 dígitos + dígito verificador
  const campo2Base = (random3 + random4).substring(0, 10);
  const dv2 = calcularDigitoVerificador(campo2Base);
  const campo2Formatado = campo2Base.substring(0, 5) + '.' + campo2Base.substring(5, 10) + dv2;
  
  // Terceiro campo: 5 dígitos + 5 dígitos + dígito verificador
  const campo3Base = (random5 + random6).substring(0, 10);
  const dv3 = calcularDigitoVerificador(campo3Base);
  const campo3Formatado = campo3Base.substring(0, 5) + '.' + campo3Base.substring(5, 10) + dv3;
  
  // Quarto campo: Fator de vencimento (dias desde 07/10/1997)
  const dataBase = new Date('1997-10-07');
  const dataVenc = new Date(dataVencimento);
  const dias = Math.floor((dataVenc - dataBase) / (1000 * 60 * 60 * 24));
  const fatorVencimento = dias > 0 ? dias.toString().padStart(4, '0') : '0001';
  
  // Quinto campo: Valor do boleto (14 dígitos - 10 dígitos do valor + 4 zeros)
  const valorFormatado = valorStr.padStart(14, '0');
  
  // Monta a linha digitável completa
  const linhaDigitavel = `${campo1Formatado} ${campo2Formatado} ${campo3Formatado} ${fatorVencimento} ${valorFormatado}`;
  
  return linhaDigitavel;
};

/**
 * Solicita segunda via do boleto
 */
const solicitarSegundaVia = (req, res) => {
  try {
    const { cpf, data, email } = req.body;

    // Validações
    if (!cpf) {
      return res.status(400).json({
        error: 'CPF obrigatório',
        message: 'Por favor, informe o CPF do cliente'
      });
    }

    if (!data) {
      return res.status(400).json({
        error: 'Data obrigatória',
        message: 'Por favor, informe a data do boleto'
      });
    }

    // Validação básica de CPF (11 dígitos)
    const cpfLimpo = cpf.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
      return res.status(400).json({
        error: 'CPF inválido',
        message: 'CPF deve conter 11 dígitos'
      });
    }

    // Validação de data
    const dataBoleto = new Date(data);
    if (isNaN(dataBoleto.getTime())) {
      return res.status(400).json({
        error: 'Data inválida',
        message: 'Por favor, informe uma data válida'
      });
    }

    // Gera código aleatório para o boleto
    const codigoBoleto = gerarCodigoBoleto();

    // Simula busca de informações do boleto baseado em CPF e data
    // Em produção, isso viria de um banco de dados
    const boletoExistente = boletos.find(b => {
      const cpfBoleto = b.cliente.cpf.replace(/\D/g, '');
      const dataBoletoExistente = new Date(b.vencimento);
      const dataInformada = new Date(data);
      
      return cpfBoleto === cpfLimpo && 
             dataBoletoExistente.toDateString() === dataInformada.toDateString();
    });

    // Se não encontrar boleto, cria um novo com dados simulados
    const valorBoleto = boletoExistente ? boletoExistente.valor : 150.00;
    const statusBoleto = boletoExistente ? boletoExistente.status : 'pendente';
    const nomeCliente = boletoExistente ? boletoExistente.cliente.nome : 'Cliente';

    // Gera linha digitável do boleto
    const linhaDigitavel = gerarLinhaDigitavel(cpf, valorBoleto, data);

    // Gera link da segunda via
    const linkSegundaVia = `https://sistema.com/boletos/${codigoBoleto}/segunda-via?token=${Date.now()}`;

    res.json({
      message: 'Segunda via gerada com sucesso',
      boleto: {
        codigo: codigoBoleto,
        valor: valorBoleto,
        vencimento: data,
        status: statusBoleto,
        linhaDigitavel: linhaDigitavel,
        cliente: {
          nome: nomeCliente,
          cpf: cpf
        }
      },
      linkSegundaVia,
      emailEnviado: email || null,
      dataSolicitacao: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao solicitar segunda via:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível gerar a segunda via do boleto'
    });
  }
};

/**
 * Busca informações de um boleto
 */
const buscarBoleto = (req, res) => {
  try {
    const { codigo } = req.params;
    const boleto = boletos.find(b => b.codigo === codigo);

    if (!boleto) {
      return res.status(404).json({
        error: 'Boleto não encontrado',
        message: `Boleto com código ${codigo} não foi encontrado`
      });
    }

    // Retorna informações básicas (sem dados sensíveis completos)
    res.json({
      codigo: boleto.codigo,
      valor: boleto.valor,
      vencimento: boleto.vencimento,
      status: boleto.status,
      cliente: {
        nome: boleto.cliente.nome
      }
    });
  } catch (error) {
    console.error('Erro ao buscar boleto:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: 'Não foi possível buscar o boleto'
    });
  }
};

module.exports = {
  solicitarSegundaVia,
  buscarBoleto
};

