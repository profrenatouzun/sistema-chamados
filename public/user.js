// Verificar se está logado
const usuarioLogado = localStorage.getItem('usuario');
if (!usuarioLogado) {
    window.location.href = '/login.html';
} else {
    const usuario = JSON.parse(usuarioLogado);
    if (usuario.tipo === 'admin') {
        window.location.href = '/';
    }
    
    // Atualizar informações do usuário
    document.getElementById('userName').textContent = usuario.nome;
    document.getElementById('userEmail').textContent = usuario.email;
    document.getElementById('userAvatar').textContent = usuario.nome.charAt(0).toUpperCase();
    document.getElementById('emailSenha').value = usuario.email;
}

function logout() {
    localStorage.removeItem('usuario');
    window.location.href = '/login.html';
}

function abrirModalSenha() {
    document.getElementById('modalSenha').classList.add('show');
    document.getElementById('formAlterarSenha').reset();
    document.getElementById('errorSenha').style.display = 'none';
}

function fecharModalSenha() {
    document.getElementById('modalSenha').classList.remove('show');
}

function fecharModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// Formulário de alterar senha
document.getElementById('formAlterarSenha').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const senhaAtual = document.getElementById('senhaAtual').value;
    const novaSenha = document.getElementById('novaSenha').value;
    const confirmarSenha = document.getElementById('confirmarSenha').value;
    const errorSenha = document.getElementById('errorSenha');
    
    if (novaSenha !== confirmarSenha) {
        errorSenha.textContent = 'As senhas não coincidem';
        errorSenha.style.display = 'block';
        return;
    }
    
    if (novaSenha.length < 6) {
        errorSenha.textContent = 'A senha deve ter no mínimo 6 caracteres';
        errorSenha.style.display = 'block';
        return;
    }
    
    try {
        const response = await fetch('/api/auth/alterar-senha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: usuario.email,
                senhaAtual: senhaAtual,
                novaSenha: novaSenha,
                confirmarSenha: confirmarSenha
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Senha alterada com sucesso!');
            fecharModalSenha();
        } else {
            errorSenha.textContent = data.message || 'Erro ao alterar senha';
            errorSenha.style.display = 'block';
        }
    } catch (error) {
        errorSenha.textContent = 'Erro ao conectar com o servidor';
        errorSenha.style.display = 'block';
    }
});

// Verificação de CEP
function abrirVerificacaoCEP() {
    const modal = document.getElementById('modalVerificacao');
    const conteudo = document.getElementById('conteudoVerificacao');
    
    conteudo.innerHTML = `
        <form id="formCEP" style="margin-bottom: 20px;">
            <div class="form-group">
                <label>CEP</label>
                <input type="text" id="cep" placeholder="00000-000" required>
            </div>
            <button type="submit" class="btn btn-primary">Verificar</button>
        </form>
        <div id="resultadoCEP"></div>
    `;
    
    modal.classList.add('show');
    
    document.getElementById('formCEP').addEventListener('submit', async (e) => {
        e.preventDefault();
        const cep = document.getElementById('cep').value.replace(/\D/g, '');
        
        try {
            const response = await fetch(`/api/verificacao/cep/${cep}`);
            const data = await response.json();
            
            if (response.ok) {
                document.getElementById('resultadoCEP').innerHTML = `
                    <div class="card" style="margin-top: 20px;">
                        <h3>Resultado da Verificação</h3>
                        <p><strong>CEP:</strong> ${data.cep}</p>
                        <p><strong>Endereço:</strong> ${data.endereco.logradouro}, ${data.endereco.bairro}</p>
                        <p><strong>Cidade:</strong> ${data.endereco.cidade} - ${data.endereco.uf}</p>
                        <p><strong>Serviço Disponível:</strong> ${data.servicoDisponivel ? '✅ Sim' : '❌ Não'}</p>
                        <p>${data.mensagem}</p>
                    </div>
                `;
            } else {
                document.getElementById('resultadoCEP').innerHTML = `
                    <div class="error-message" style="margin-top: 20px;">
                        ${data.message || 'Erro ao verificar CEP'}
                    </div>
                `;
            }
        } catch (error) {
            document.getElementById('resultadoCEP').innerHTML = `
                <div class="error-message" style="margin-top: 20px;">
                    Erro ao conectar com o servidor
                </div>
            `;
        }
    });
}

// Segunda Via de Boleto
function abrirSegundaVia() {
    const modal = document.getElementById('modalSegundaVia');
    const conteudo = document.getElementById('conteudoSegundaVia');
    
    conteudo.innerHTML = `
        <form id="formSegundaVia" style="margin-bottom: 20px;">
            <div class="form-group">
                <label>CPF</label>
                <input type="text" id="cpf" placeholder="000.000.000-00" required>
            </div>
            <div class="form-group">
                <label>Data do Boleto</label>
                <input type="date" id="dataBoleto" required>
            </div>
            <div class="form-group">
                <label>Email (opcional)</label>
                <input type="email" id="emailBoleto" placeholder="seu@email.com">
            </div>
            <button type="submit" class="btn btn-primary">Gerar Segunda Via</button>
        </form>
        <div id="resultadoSegundaVia"></div>
    `;
    
    modal.classList.add('show');
    
    document.getElementById('formSegundaVia').addEventListener('submit', async (e) => {
        e.preventDefault();
        const cpf = document.getElementById('cpf').value;
        const data = document.getElementById('dataBoleto').value;
        const email = document.getElementById('emailBoleto').value;
        
        try {
            const response = await fetch('/api/boletos/segunda-via', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ cpf, data, email })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                document.getElementById('resultadoSegundaVia').innerHTML = `
                    <div class="card" style="margin-top: 20px;">
                        <h3>Segunda Via Gerada</h3>
                        <p><strong>Código:</strong> ${data.boleto.codigo}</p>
                        <p><strong>Valor:</strong> R$ ${data.boleto.valor.toFixed(2)}</p>
                        <p><strong>Vencimento:</strong> ${new Date(data.boleto.vencimento).toLocaleDateString('pt-BR')}</p>
                        <p><strong>Status:</strong> ${data.boleto.status}</p>
                        <p><strong>Linha Digitável:</strong> ${data.boleto.linhaDigitavel}</p>
                        <p><strong>Link:</strong> <a href="${data.linkSegundaVia}" target="_blank">${data.linkSegundaVia}</a></p>
                    </div>
                `;
            } else {
                document.getElementById('resultadoSegundaVia').innerHTML = `
                    <div class="error-message" style="margin-top: 20px;">
                        ${data.message || 'Erro ao gerar segunda via'}
                    </div>
                `;
            }
        } catch (error) {
            document.getElementById('resultadoSegundaVia').innerHTML = `
                <div class="error-message" style="margin-top: 20px;">
                    Erro ao conectar com o servidor
                </div>
            `;
        }
    });
}

// Abrir Reclamação
function abrirReclamacao() {
    const modal = document.getElementById('modalReclamacao');
    const conteudo = document.getElementById('conteudoReclamacao');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    conteudo.innerHTML = `
        <form id="formReclamacao" style="margin-bottom: 20px;">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="nomeReclamacao" value="${usuario.nome}" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="emailReclamacao" value="${usuario.email}" required>
            </div>
            <div class="form-group">
                <label>Telefone</label>
                <input type="text" id="telefoneReclamacao" placeholder="(00) 00000-0000">
            </div>
            <div class="form-group">
                <label>Assunto</label>
                <input type="text" id="assuntoReclamacao" required>
            </div>
            <div class="form-group">
                <label>Descrição</label>
                <textarea id="descricaoReclamacao" rows="4" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;"></textarea>
            </div>
            <div class="form-group">
                <label>CEP</label>
                <input type="text" id="cepReclamacao" placeholder="00000-000">
            </div>
            <button type="submit" class="btn btn-primary">Enviar Reclamação</button>
        </form>
        <div id="resultadoReclamacao"></div>
    `;
    
    modal.classList.add('show');
    
    document.getElementById('formReclamacao').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            nome: document.getElementById('nomeReclamacao').value,
            email: document.getElementById('emailReclamacao').value,
            telefone: document.getElementById('telefoneReclamacao').value,
            assunto: document.getElementById('assuntoReclamacao').value,
            descricao: document.getElementById('descricaoReclamacao').value,
            cep: document.getElementById('cepReclamacao').value
        };
        
        try {
            const response = await fetch('/api/reclamacoes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                document.getElementById('resultadoReclamacao').innerHTML = `
                    <div class="card" style="margin-top: 20px; background: #d4edda; border-color: #c3e6cb;">
                        <h3>✅ Reclamação criada com sucesso!</h3>
                        <p><strong>ID:</strong> ${data.reclamacao.id}</p>
                        <p><strong>Status:</strong> ${data.reclamacao.status}</p>
                    </div>
                `;
                document.getElementById('formReclamacao').reset();
            } else {
                document.getElementById('resultadoReclamacao').innerHTML = `
                    <div class="error-message" style="margin-top: 20px;">
                        ${data.message || 'Erro ao criar reclamação'}
                    </div>
                `;
            }
        } catch (error) {
            document.getElementById('resultadoReclamacao').innerHTML = `
                <div class="error-message" style="margin-top: 20px;">
                    Erro ao conectar com o servidor
                </div>
            `;
        }
    });
}

// Abrir Chamado
function abrirChamado() {
    const modal = document.getElementById('modalChamado');
    const conteudo = document.getElementById('conteudoChamado');
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    
    conteudo.innerHTML = `
        <form id="formChamado" style="margin-bottom: 20px;">
            <div class="form-group">
                <label>Nome</label>
                <input type="text" id="nomeChamado" value="${usuario.nome}" required>
            </div>
            <div class="form-group">
                <label>Email</label>
                <input type="email" id="emailChamado" value="${usuario.email}" required>
            </div>
            <div class="form-group">
                <label>Telefone</label>
                <input type="text" id="telefoneChamado" placeholder="(00) 00000-0000">
            </div>
            <div class="form-group">
                <label>Categoria</label>
                <select id="categoriaChamado" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
                    <option value="">Selecione...</option>
                    <option value="tecnico">Técnico</option>
                    <option value="financeiro">Financeiro</option>
                    <option value="comercial">Comercial</option>
                    <option value="suporte">Suporte</option>
                    <option value="outros">Outros</option>
                </select>
            </div>
            <div class="form-group">
                <label>Assunto</label>
                <input type="text" id="assuntoChamado" required>
            </div>
            <div class="form-group">
                <label>Descrição</label>
                <textarea id="descricaoChamado" rows="4" required style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;"></textarea>
            </div>
            <div class="form-group">
                <label>Prioridade</label>
                <select id="prioridadeChamado" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px;">
                    <option value="baixa">Baixa</option>
                    <option value="media" selected>Média</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Abrir Chamado</button>
        </form>
        <div id="resultadoChamado"></div>
    `;
    
    modal.classList.add('show');
    
    document.getElementById('formChamado').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const dados = {
            nome: document.getElementById('nomeChamado').value,
            email: document.getElementById('emailChamado').value,
            telefone: document.getElementById('telefoneChamado').value,
            categoria: document.getElementById('categoriaChamado').value,
            assunto: document.getElementById('assuntoChamado').value,
            descricao: document.getElementById('descricaoChamado').value,
            prioridade: document.getElementById('prioridadeChamado').value
        };
        
        try {
            const response = await fetch('/api/chamados', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                document.getElementById('resultadoChamado').innerHTML = `
                    <div class="card" style="margin-top: 20px; background: #d4edda; border-color: #c3e6cb;">
                        <h3>✅ Chamado aberto com sucesso!</h3>
                        <p><strong>Número:</strong> ${data.chamado.numero}</p>
                        <p><strong>Status:</strong> ${data.chamado.status}</p>
                    </div>
                `;
                document.getElementById('formChamado').reset();
            } else {
                document.getElementById('resultadoChamado').innerHTML = `
                    <div class="error-message" style="margin-top: 20px;">
                        ${data.message || 'Erro ao abrir chamado'}
                    </div>
                `;
            }
        } catch (error) {
            document.getElementById('resultadoChamado').innerHTML = `
                <div class="error-message" style="margin-top: 20px;">
                    Erro ao conectar com o servidor
                </div>
            `;
        }
    });
}

