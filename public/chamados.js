// Carregar chamados
async function loadChamados() {
    const status = document.getElementById('filter-status').value;
    const categoria = document.getElementById('filter-categoria').value;
    const email = document.getElementById('filter-email').value;

    let url = '/api/chamados?';
    const params = [];
    if (status) params.push(`status=${status}`);
    if (categoria) params.push(`categoria=${categoria}`);
    if (email) params.push(`email=${email}`);
    url += params.join('&');

    try {
        const response = await fetch(url);
        const data = await response.json();
        const chamados = data.chamados || [];

        if (chamados.length === 0) {
            document.getElementById('chamados-list').innerHTML = 
                '<p class="empty">Nenhum chamado encontrado</p>';
            return;
        }

        const chamadosHtml = chamados.map(chamado => `
            <div class="chamado-item" onclick="showChamadoDetails(${chamado.id})">
                <div class="item-header">
                    <h4>${chamado.numero} - ${chamado.assunto}</h4>
                    <span class="badge badge-${chamado.status}">${formatStatus(chamado.status)}</span>
                </div>
                <p>${chamado.descricao.substring(0, 100)}${chamado.descricao.length > 100 ? '...' : ''}</p>
                <div class="item-meta">
                    <span><strong>Categoria:</strong> ${formatCategoria(chamado.categoria)}</span>
                    <span><strong>Prioridade:</strong> ${formatPrioridade(chamado.prioridade)}</span>
                    <span><strong>Cliente:</strong> ${chamado.nome}</span>
                    <span><strong>Data:</strong> ${formatDate(chamado.dataAbertura)}</span>
                </div>
            </div>
        `).join('');

        document.getElementById('chamados-list').innerHTML = chamadosHtml;
    } catch (error) {
        console.error('Erro ao carregar chamados:', error);
        document.getElementById('chamados-list').innerHTML = 
            '<p class="error">Erro ao carregar chamados</p>';
    }
}

// Mostrar detalhes do chamado
async function showChamadoDetails(id) {
    try {
        const response = await fetch(`/api/chamados/${id}`);
        const chamado = await response.json();

        const mensagensHtml = chamado.mensagens.map(msg => `
            <div class="list-item">
                <div>
                    <strong>${msg.autor}</strong>
                    <span class="badge badge-${msg.tipo}">${msg.tipo}</span>
                </div>
                <p>${msg.mensagem}</p>
                <small>${formatDate(msg.data)}</small>
            </div>
        `).join('');

        document.getElementById('chamado-details').innerHTML = `
            <h3>${chamado.numero} - ${chamado.assunto}</h3>
            <div class="info-item">
                <strong>Status:</strong>
                <select id="status-select" onchange="updateChamadoStatus(${chamado.id})">
                    <option value="aberto" ${chamado.status === 'aberto' ? 'selected' : ''}>Aberto</option>
                    <option value="em_andamento" ${chamado.status === 'em_andamento' ? 'selected' : ''}>Em Andamento</option>
                    <option value="aguardando_cliente" ${chamado.status === 'aguardando_cliente' ? 'selected' : ''}>Aguardando Cliente</option>
                    <option value="resolvido" ${chamado.status === 'resolvido' ? 'selected' : ''}>Resolvido</option>
                    <option value="fechado" ${chamado.status === 'fechado' ? 'selected' : ''}>Fechado</option>
                </select>
            </div>
            <div class="info-item">
                <strong>Categoria:</strong> ${formatCategoria(chamado.categoria)}
            </div>
            <div class="info-item">
                <strong>Prioridade:</strong> ${formatPrioridade(chamado.prioridade)}
            </div>
            <div class="info-item">
                <strong>Cliente:</strong> ${chamado.nome} (${chamado.email})
            </div>
            <div class="info-item">
                <strong>Telefone:</strong> ${chamado.telefone || 'Não informado'}
            </div>
            <div class="info-item">
                <strong>Descrição:</strong>
                <p>${chamado.descricao}</p>
            </div>
            <div class="info-item">
                <strong>Mensagens (${chamado.mensagens.length}):</strong>
                <div class="list-container">
                    ${mensagensHtml}
                </div>
            </div>
            <div class="info-item">
                <strong>Adicionar Mensagem:</strong>
                <form onsubmit="addMensagemChamado(event, ${chamado.id})">
                    <textarea name="mensagem" rows="3" required placeholder="Digite sua mensagem..."></textarea>
                    <button type="submit" class="btn btn-primary" style="margin-top: 0.5rem;">Enviar Mensagem</button>
                </form>
            </div>
            <div class="info-item">
                <strong>Data de Abertura:</strong> ${formatDate(chamado.dataAbertura)}
            </div>
            <div class="info-item">
                <strong>Última Atualização:</strong> ${formatDate(chamado.dataAtualizacao)}
            </div>
        `;

        document.getElementById('chamado-modal').style.display = 'block';
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        showNotification('Erro ao carregar detalhes do chamado', 'error');
    }
}

// Atualizar status do chamado
async function updateChamadoStatus(id) {
    const status = document.getElementById('status-select').value;

    try {
        const response = await fetch(`/api/chamados/${id}/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });

        if (response.ok) {
            showNotification('Status atualizado com sucesso!', 'success');
            loadChamados();
            // Atualizar modal
            setTimeout(() => showChamadoDetails(id), 500);
        } else {
            const error = await response.json();
            showNotification(error.message || 'Erro ao atualizar status', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao atualizar status', 'error');
    }
}

// Adicionar mensagem ao chamado
async function addMensagemChamado(event, id) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const mensagem = formData.get('mensagem');

    try {
        const response = await fetch(`/api/chamados/${id}/mensagens`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensagem })
        });

        if (response.ok) {
            showNotification('Mensagem adicionada com sucesso!', 'success');
            event.target.reset();
            // Atualizar modal
            setTimeout(() => showChamadoDetails(id), 500);
        } else {
            const error = await response.json();
            showNotification(error.message || 'Erro ao adicionar mensagem', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao adicionar mensagem', 'error');
    }
}

// Criar novo chamado
async function createChamado(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = {
        nome: formData.get('nome'),
        email: formData.get('email'),
        telefone: formData.get('telefone') || null,
        categoria: formData.get('categoria'),
        assunto: formData.get('assunto'),
        descricao: formData.get('descricao'),
        prioridade: formData.get('prioridade') || 'media'
    };

    try {
        const response = await fetch('/api/chamados', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showNotification('Chamado criado com sucesso!', 'success');
            event.target.reset();
            hideNewChamadoForm();
            loadChamados();
        } else {
            showNotification(result.message || 'Erro ao criar chamado', 'error');
        }
    } catch (error) {
        console.error('Erro:', error);
        showNotification('Erro ao criar chamado', 'error');
    }
}

// Mostrar/esconder formulário
function showNewChamadoForm() {
    document.getElementById('new-chamado-form').style.display = 'block';
    document.getElementById('new-chamado-form').scrollIntoView({ behavior: 'smooth' });
}

function hideNewChamadoForm() {
    document.getElementById('new-chamado-form').style.display = 'none';
}

// Carregar chamados ao carregar a página
if (document.getElementById('chamados-list')) {
    loadChamados();
}

// Verificar se há ação de novo chamado na URL
if (window.location.search.includes('action=new')) {
    showNewChamadoForm();
}

