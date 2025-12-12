// Funções utilitárias globais

// Toggle Sidebar (mobile)
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

// Ativar item do menu baseado na URL
function setActiveMenu() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href') === currentPath || 
            (currentPath === '/' && item.getAttribute('href') === '/')) {
            item.classList.add('active');
        }
    });
}

// Formatar data
function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatar status
function formatStatus(status) {
    const statusMap = {
        'aberto': 'Aberto',
        'em_andamento': 'Em Andamento',
        'aguardando_cliente': 'Aguardando Cliente',
        'resolvido': 'Resolvido',
        'fechado': 'Fechado',
        'aberta': 'Aberta',
        'em_analise': 'Em Análise',
        'resolvida': 'Resolvida',
        'cancelada': 'Cancelada'
    };
    return statusMap[status] || status;
}

// Formatar categoria
function formatCategoria(categoria) {
    const categoriaMap = {
        'tecnico': 'Técnico',
        'financeiro': 'Financeiro',
        'comercial': 'Comercial',
        'suporte': 'Suporte',
        'outros': 'Outros'
    };
    return categoriaMap[categoria] || categoria;
}

// Formatar prioridade
function formatPrioridade(prioridade) {
    const prioridadeMap = {
        'baixa': 'Baixa',
        'media': 'Média',
        'alta': 'Alta',
        'urgente': 'Urgente'
    };
    return prioridadeMap[prioridade] || prioridade;
}

// Mostrar notificação
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Fechar modal
function closeModal() {
    document.getElementById('chamado-modal').style.display = 'none';
}

function closeReclamacaoModal() {
    document.getElementById('reclamacao-modal').style.display = 'none';
}

// Fechar modal ao clicar fora
window.onclick = function(event) {
    const chamadoModal = document.getElementById('chamado-modal');
    const reclamacaoModal = document.getElementById('reclamacao-modal');
    
    if (event.target === chamadoModal) {
        chamadoModal.style.display = 'none';
    }
    if (event.target === reclamacaoModal) {
        reclamacaoModal.style.display = 'none';
    }
}

// Inicializar menu ativo ao carregar página
document.addEventListener('DOMContentLoaded', function() {
    setActiveMenu();
});

