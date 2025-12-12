// Carregar reclamações
async function loadReclamacoes() {
    const status = document.getElementById('filter-status').value;
    const email = document.getElementById('filter-email').value;

    let url = '/api/reclamacoes?';
    const params = [];
    if (status) params.push(`status=${status}`);
    if (email) params.push(`email=${email}`);
    url += params.join('&');

    try {
        const response = await fetch(url);
        const data = await response.json();
        const reclamacoes = data.reclamacoes || [];

        if (reclamacoes.length === 0) {
            document.getElementById('reclamacoes-list').innerHTML = 
                '<p class="empty">Nenhuma reclamação encontrada</p>';
            return;
        }

        const reclamacoesHtml = reclamacoes.map(reclamacao => `
            <div class="reclamacao-item" onclick="showReclamacaoDetails(${reclamacao.id})">
                <div class="item-header">
                    <h4>${reclamacao.assunto}</h4>
                    <span class="badge badge-${reclamacao.status}">${formatStatus(reclamacao.status)}</span>
                </div>
                <p>${reclamacao.descricao.substring(0, 100)}${reclamacao.descricao.length > 100 ? '...' : ''}</p>
                <div class="item-meta">
                    <span><strong>Cliente:</strong> ${reclamacao.nome}</span>
                    <span><strong>Email:</strong> ${reclamacao.email}</span>
                    <span><strong>Data:</strong> ${formatDate(reclamacao.dataCriacao)}</span>
                </div>
            </div>
        `).join('');

        document.getElementById('reclamacoes-list').innerHTML = reclamacoesHtml;
    } catch (error) {
        console.error('Erro ao carregar reclamações:', error);
        document.getElementById('reclamacoes-list').innerHTML = 
            '<p class="error">Erro ao carregar reclamações</p>';
    }
}

// Mostrar detalhes da reclamação
async function showReclamacaoDetails(id) {
    try {
        const response = await fetch(`/api/reclamacoes/${id}`);
        const reclamacao = await response.json();

        document.getElementById('reclamacao-details').innerHTML = `
            <h3>${reclamacao.assunto}</h3>
            <div class="info-item">
                <strong>Status:</strong>
                <select id="status-select" onchange="updateReclamacaoStatus(${reclamacao.id})">
                    <option value="aberta" ${reclamacao.status === 'aberta' ? 'selected' : ''}>Aberta</option>
                    <option value="em_analise" ${reclamacao.status === 'em_analise' ? 'selected' : ''}>Em Análise</option>
                    <option value="resolvida" ${reclamacao.status === 'resolvida' ? 'selected' : ''}>Resolvida</option>
                    <option value="cancelada" ${reclamacao.status === 'cancelada' ? 'selected' : ''}>Cancelada</option>
                </select>
            </div>
            <div class="info-item">
                <strong>Cliente:</strong> ${reclamacao.nome}
            </div>
            <div class="info-item">
                <strong>Email:</strong> ${reclamacao.email}
            </div>
            <div class="info-item">
                <strong>Telefone:</strong> ${reclamacao.telefone || 'Não informado'}
            </div>
            <div class="info-item">
                <strong>CEP:</strong> ${reclamacao.cep || 'Não informado'}
            </div>
            <div class="info-item">
                <strong>Descrição:</strong>
                <p>${reclamacao.descricao}</p>
            </div>
            <div class="info-item">
                <strong>Data de Criação:</strong> ${formatDate(reclamacao.dataCriacao)}
            </div>
            <div class="info-item">
                <strong>Última Atualização:</strong> ${formatDate(reclamacao.dataAtualizacao)}
            </div>
        `;

        document.getElementById('reclamacao-modal').style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        showNotification('Erro ao carregar detalhes da reclamação', 'error');
    }
}

// Atualizar status da reclamação
async function updateReclamacaoStatus(id) {
    const status = document.getElementById('status-select').value;

    try {
        const response = await fetch(`/api/reclamacoes/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            showNotification('Status atualizado com sucesso!', 'success');
            loadReclamacoes();
            // Atualizar modal
            setTimeout(() => showReclamacaoDetails(id), 500);
        } else {
            const error = await response.json();
            showNotification(error.message || 'Erro ao atualizar status', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao atualizar status', 'error');
    }
}

// Criar nova reclamação
async function createReclamacao(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone') || null,
        cep: formData.get('cep') || null,
        assunto: formData.get('assunto'),
        descricao: formData.get('descricao')
    };

    try {
        const response = await fetch('/api/reclamacoes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Reclamação criada com sucesso!', 'success');
            event.target.reset();
            hideNewReclamacaoForm();
            loadReclamacoes();
        } else {
            showNotification(result.message || 'Erro ao criar reclamação', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao criar reclamação', 'error');
    }
}

// Mostrar/esconder formulário
function showNewReclamacaoForm() {
    document.getElementById('new-reclamacao-form').style.display = 'block';
    document.getElementById('new-reclamacao-form').scrollIntoView({ behavior: 'smooth' });
}

function hideNewReclamacaoForm() {
    document.getElementById('new-reclamacao-form').style.display = 'none';
}

// Carregar reclamações ao carregar a página
if (document.getElementById('reclamacoes-list')) {
    loadReclamacoes();
}

// Verificar se há ação de nova reclamação na URL
if (window.location.search.includes('action=new')) {
    showNewReclamacaoForm();
}

