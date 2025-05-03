const login = document.getElementById('login');
const admin = document.getElementById('admin');
const cardapio = document.getElementById('cardapio');
const telaPedidos = document.getElementById('telaPedidos');
const selectCategoria = document.getElementById('selectCategoria');
const listaCardapio = document.getElementById('listaCardapio');
const itensCarrinho = document.getElementById('itensCarrinho');
const logoInput = document.getElementById('logoInput');
const logoImg = document.getElementById('logoImg');
const carrinhoModal = document.getElementById('carrinhoModal');
const detalhesPedido = document.getElementById('detalhesPedido');
const btnSair = document.getElementById('btnSair');

let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
let carrinho = [];

atualizarSelect();
atualizarSelectProdutos();
atualizarSelectCategoriasExcluir();

logoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            logoImg.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
});
function logar() {
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('senha').value;
    if (usuario === 'admin' && senha === '1234') {
        login.classList.add('hidden');
        admin.classList.remove('hidden');
        btnSair.classList.remove('hidden');
        
        document.getElementById('btnIrCardapio').classList.remove('hidden');
        document.getElementById('btnCompartilhar').classList.remove('hidden');
        document.getElementById('btn-excluir-produto').classList.remove('hidden');
        document.getElementById('btn-excluir-categoria').classList.remove('hidden');

        const pedidosButton = document.createElement('button');
        pedidosButton.textContent = 'Pedidos';
        pedidosButton.onclick = mostrarPedidosAdmin;
        pedidosButton.id = 'btnPedidos';
        document.getElementById('btnIrCardapio').parentNode.insertBefore(pedidosButton, document.getElementById('btnCompartilhar').nextSibling);
        document.getElementById('btnPedidos').classList.remove('hidden');
    } else {
        alert('Usuário ou senha inválidos!');
    }
}
function logout() {
    // Limpar cache
    localStorage.clear();
    sessionStorage.clear();
    carrinho = [];

    // Limpar campos de login
    document.getElementById('usuario').value = '';
    document.getElementById('senha').value = '';

    // Redirecionar para a página de login
    login.classList.remove('hidden');
    admin.classList.add('hidden');
    cardapio.classList.add('hidden');
    telaPedidos.classList.add('hidden');
    btnSair.classList.add('hidden');
    
    document.getElementById('btnIrCardapio').classList.add('hidden');
    document.getElementById('btnCompartilhar').classList.add('hidden');
    atualizarCarrinho();
}
function adicionarCategoria() {
    const categoria = document.getElementById('novaCategoria').value;
    if (categoria) {
        categorias.push(categoria);
        localStorage.setItem('categorias', JSON.stringify(categorias));
        atualizarSelect();
        atualizarSelectCategoriasExcluir();
        document.getElementById('novaCategoria').value = '';
    }
}

function atualizarSelect() {
    selectCategoria.innerHTML = '';
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        selectCategoria.appendChild(option);
    });
}

function adicionarProduto() {
    const nome = document.getElementById('nomeProduto').value;
    const preco = document.getElementById('precoProduto').value;
    const itens = document.getElementById('itensProduto').value;
    const imagem = document.getElementById('imagemProduto').files[0];
    const categoria = document.getElementById('selectCategoria').value;

    if (nome && preco && imagem && categoria) {
        const reader = new FileReader();
        reader.onload = (e) => {
            let produtosStorage = JSON.parse(localStorage.getItem('produtos')) || [];
            produtosStorage.push({
                nome,
                preco,
                itens,
                imagem: e.target.result,
                categoria
            });
            localStorage.setItem('produtos', JSON.stringify(produtosStorage));
            produtos = produtosStorage;
            atualizarSelectProdutos();
            renderizarCardapio();
            document.getElementById('nomeProduto').value = '';
            document.getElementById('precoProduto').value = '';
            document.getElementById('itensProduto').value = '';
            document.getElementById('imagemProduto').value = '';
            alert(`Produto "${nome}" cadastrado com sucesso!`);

        };
        reader.readAsDataURL(imagem);
    }
}

function mostrarCardapio() {
    admin.classList.add('hidden');
    cardapio.classList.remove('hidden');
    renderizarCardapio();
}

function voltarAdmin() {
    cardapio.classList.add('hidden');
    admin.classList.remove('hidden');
}



function renderizarCardapio() {
    listaCardapio.innerHTML = '';
    categorias.forEach(cat => {
        const titulo = document.createElement('h3');
        titulo.textContent = cat;
        listaCardapio.appendChild(titulo);

        produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        produtos.filter(p => p.categoria === cat).forEach(prod => {
            const div = document.createElement('div');
            div.className = 'produto';
            let botoes = '';
            if (!window.location.search.includes("shared=true")) {
                botoes = `<button onclick='editarProduto(${JSON.stringify(prod)})'>Editar</button>`;
            }
            div.innerHTML = `
                <img src="${prod.imagem}" style="width: 80px; height: 80px; object-fit: cover; float: left; margin-right: 10px;">
                <div style="overflow: hidden;">
                    <h4 style="margin-bottom: 5px; text-align: left;">${prod.nome}</h4>
                    <p style="font-size: 14px; margin-bottom: 5px; text-align: left;">${prod.itens}</p>
                    <p style="font-size: 16px; font-weight: bold; margin-bottom: 5px; text-align: left;">R$ ${prod.preco}</p>
                    <button 
                        onclick='adicionarAoCarrinho(${JSON.stringify(prod)})' 
                        style="padding: 0; height: 40px; font-size: 14px; border: none; border-radius: 5px; background-color: #4CAF50; color: #fff; cursor: pointer; display: flex; justify-content: center; align-items: center; width: 100%;">
                        Adicionar ao Carrinho
                    </button>
                    ${botoes}
                </div>
                <div style="clear: both;"></div>
            `;
            listaCardapio.appendChild(div);
        });
    });
}
function mostrarCarrinho() {
    carrinhoModal.style.display = 'block';
    atualizarCarrinho();
}

function fecharCarrinho() {
    carrinhoModal.style.display = 'none';
}
function adicionarAoCarrinho(produto) {
    const quantidade = parseInt(prompt("Quantidade:")) || 1; // Pergunta ao usuário a quantidade
    const observacao = prompt("Observação (opcional):") || ""; // Pergunta ao usuário se ele deseja adicionar alguma observação

    carrinho.push({
        produto: produto.nome,
        itens: produto.itens,
        observacao: observacao,
        quantidade: quantidade,
        preco: parseFloat(produto.preco)
    });

    atualizarCarrinho();
    mostrarCarrinho();
}

function atualizarCarrinho() {
    itensCarrinho.innerHTML = '';
    let total = 0;
    carrinho.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'carrinho-item';
        div.innerHTML = `
                    <ul>
                        <li><strong>Produto:</strong> ${item.produto}</li>
                        <li><strong>Itens:</strong> ${item.itens}</li>
                        <li><strong>Observação:</strong> ${item.observacao}</li>
                        <li><strong>Quantidade:</strong> ${item.quantidade}</li>
                        <li><strong>Preço:</strong> R$ ${item.preco * item.quantidade}</li>
                    </ul>
                    <button class="remover-x" onclick="removerItem(${index})">X</button>
                `;
        itensCarrinho.appendChild(div);
        total += item.preco * item.quantidade;
    });

    const entrega = document.querySelector('input[name="entregaRetirada"]:checked');
    let taxaEntrega = 0;
    if (entrega && entrega.value === 'entrega') {
        taxaEntrega = 4.00;
        total += taxaEntrega;
        const divTaxa = document.createElement('div');
        divTaxa.textContent = `Taxa de entrega: R$ ${taxaEntrega.toFixed(2)}`;
        itensCarrinho.appendChild(divTaxa);
    }

    const divTotal = document.createElement('div');
    divTotal.textContent = `Total: R$ ${total.toFixed(2)}`;
    itensCarrinho.appendChild(divTotal);
}

const entregaRetiradaInputs = document.querySelectorAll('input[name="entregaRetirada"]');
entregaRetiradaInputs.forEach(input => {
    input.addEventListener('change', atualizarCarrinho);
});

function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}
function tocarSomNotificacao() {
    const som = new Audio('C:\Users\angelica\Desktop\edidtando novo');
    som.onerror = () => {
      console.error('Erro ao reproduzir o som');
    };
    som.play();
  }

function confirmarPedido() {
    const pagamento = document.querySelector('input[name="pagamento"]:checked');
    const entregaRetirada = document.querySelector('input[name="entregaRetirada"]:checked');
    const nomeCliente = document.getElementById('nomeCliente').value.trim();
    const endereco = document.getElementById('endereco').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const numero = document.getElementById('numero').value.trim();

    if (!pagamento) {
        alert('Selecione uma forma de pagamento!');
        return;
    }

    if (!entregaRetirada) {
        alert('Selecione uma opção de entrega ou retirada!');
        return;
    }

    if (nomeCliente === '') {
        alert('Preencha o nome do cliente!');
        document.getElementById('nomeCliente').focus();
        return;
    }

    let mensagem = `Pedido confirmado!%0A`;
    mensagem += `Nome do cliente: ${nomeCliente}%0A`;
    mensagem += `Forma de pagamento: ${pagamento.value}%0A`;
    mensagem += `Entrega/Retirada: ${entregaRetirada.value}%0A`;

    if (entregaRetirada.value === 'entrega') {
        mensagem += `Endereço: ${endereco}, ${numero} - ${bairro}%0A`;
    }

    const linkWhatsApp = `https://wa.me/5532984885431?text=${mensagem}`;

    window.open(linkWhatsApp, '_blank');

    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    pedidos.push({
        nomeCliente: nomeCliente,
        pagamento: pagamento.value,
        entregaRetirada: entregaRetirada.value,
        endereco: endereco + ', ' + numero + ' - ' + bairro,
        itens: carrinho,
    });
    localStorage.setItem('pedidos', JSON.stringify(pedidos));

    tocarSomNotificacao();

    carrinho = [];
    atualizarCarrinho();
    document.getElementById('nomeCliente').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('trocoPara').value = '';
    document.querySelector('input[name="pagamento"]:checked').checked = false;
    document.querySelector('input[name="entregaRetirada"]:checked').checked = false;
}
function excluirProduto() {
    const selectProduto = document.getElementById('select-produto');
    const produto = selectProduto.value;
    if (produto) {
        produtos = JSON.parse(localStorage.getItem('produtos')) || [];
        produtos = produtos.filter(p => p.nome !== produto);
        localStorage.setItem('produtos', JSON.stringify(produtos));
        atualizarSelectProdutos();
        renderizarCardapio();
    }
}

function atualizarSelectProdutos() {
    const selectProduto = document.getElementById('select-produto');
    selectProduto.innerHTML = '<option value="">Selecione um produto</option>';
    produtos.forEach(prod => {
        const option = document.createElement('option');
        option.value = prod.nome;
        option.textContent = prod.nome;
        selectProduto.appendChild(option);
    });
}

function editarProduto(produto) {
    const modalEditarProduto = document.getElementById('modal-editar-produto');
    if (!modalEditarProduto) {
        const modal = document.createElement('div');
        modal.id = 'modal-editar-produto';
        modal.innerHTML = `
            <h2>Editar Produto</h2>
            <input type="text" id="nome-produto-editar" placeholder="Nome do produto">
            <input type="text" id="preco-produto-editar" placeholder="Preço do produto">
            <textarea id="itens-produto-editar" placeholder="Itens do produto"></textarea>
            <select id="categoria-produto-editar"></select>
            <button onclick='salvarEdicaoProduto(${JSON.stringify(produto)})'>Salvar</button>
            <button onclick='fecharModalEditarProduto()'>Fechar</button>
        `;
        document.body.appendChild(modal);

        const selectCategoria = document.getElementById('categoria-produto-editar');
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            selectCategoria.appendChild(option);
        });
    }

    document.getElementById('nome-produto-editar').value = produto.nome;
    document.getElementById('preco-produto-editar').value = produto.preco;
    document.getElementById('itens-produto-editar').value = produto.itens;
    document.getElementById('categoria-produto-editar').value = produto.categoria;

    modalEditarProduto.style.display = 'block';
}

function salvarEdicaoProduto(produto) {
    const nome = document.getElementById('nome-produto-editar').value;
    const preco = document.getElementById('preco-produto-editar').value;
    const itens = document.getElementById('itens-produto-editar').value;
    const categoria = document.getElementById('categoria-produto-editar').value;

    produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    const indiceProduto = produtos.findIndex(p => p.nome === produto.nome);
    if (indiceProduto !== -1) {
        produtos[indiceProduto].nome = nome;
        produtos[indiceProduto].preco = preco;
        produtos[indiceProduto].itens = itens;
        produtos[indiceProduto].categoria = categoria;
    }

    localStorage.setItem('produtos', JSON.stringify(produtos));
    renderizarCardapio();
    atualizarSelectProdutos();
    fecharModalEditarProduto();
}

function fecharModalEditarProduto() {
    const modalEditarProduto = document.getElementById('modal-editar-produto');
    modalEditarProduto.style.display = 'none';
}

function excluirCategoria() {
    const selectCategoria = document.getElementById('select-categoria');
    const categoria = selectCategoria.value;
    if (categoria) {
        categorias = JSON.parse(localStorage.getItem('categorias')) || [];
        categorias = categorias.filter(cat => cat !== categoria);
        localStorage.setItem('categorias', JSON.stringify(categorias));
        atualizarSelect();
        atualizarSelectCategoriasExcluir();
    }
}

function atualizarSelectCategoriasExcluir() {
    const selectCategoria = document.getElementById('select-categoria');
    selectCategoria.innerHTML = '<option value="">Selecione uma categoria</option>';
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        selectCategoria.appendChild(option);
    });
}
function compartilharCardapio() {
    const menuCompartilhar = document.createElement('div');
    menuCompartilhar.innerHTML = `
        <h2>Compartilhar Cardápio</h2>
        <button onclick="compartilharNoWhatsApp()">Compartilhar no WhatsApp</button>
        <button onclick="compartilharNoFacebook()">Compartilhar no Facebook</button>
        <button onclick="compartilharNoTwitter()">Compartilhar no Twitter</button>
        <button onclick="compartilharPorEmail()">Compartilhar por e-mail</button>
        <button onclick="copiarLink()">Copiar link</button>
        <button onclick="voltarAoAdminCompartilhar()">Voltar ao Admin</button>
    `;
    menuCompartilhar.style.position = 'fixed';
    menuCompartilhar.style.top = '50%';
    menuCompartilhar.style.left = '50%';
    menuCompartilhar.style.transform = 'translate(-50%, -50%)';
    menuCompartilhar.style.background = '#fff';
    menuCompartilhar.style.padding = '20px';
    menuCompartilhar.style.border = '1px solid #ddd';
    menuCompartilhar.style.borderRadius = '10px';
    menuCompartilhar.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
    document.body.appendChild(menuCompartilhar);
}

function voltarAoAdminCompartilhar() {
    document.body.removeChild(document.querySelector('div[style*="fixed"]'));
    cardapio.classList.add('hidden');
    admin.classList.remove('hidden');
}

function compartilharNoWhatsApp() {
    const url = window.location.href + "?shared=true#cardapio";
    const mensagem = `Olha só! Estou compartilhando meu cardápio com você! ${url}`;
    const linkWhatsApp = `https://wa.me/?text=${mensagem}`;
    window.open(linkWhatsApp, '_blank');
    document.body.removeChild(document.querySelector('div[style*="fixed"]'));
}

function compartilharNoFacebook() {
    const url = window.location.href + "?shared=true#cardapio";
    const linkFacebook = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(linkFacebook, '_blank');
    document.body.removeChild(document.querySelector('div[style*="fixed"]'));
}

function compartilharNoTwitter() {
    const url = window.location.href + "?shared=true#cardapio";
    const mensagem = `Olha só! Estou compartilhando meu cardápio com você! ${url}`;
    const linkTwitter = `https://twitter.com/intent/tweet?text=${mensagem}`;
    window.open(linkTwitter, '_blank');
    document.body.removeChild(document.querySelector('div[style*="fixed"]'));
}

function compartilharPorEmail() {
    const url = window.location.href + "?shared=true#cardapio";
    const assunto = 'Olha só! Estou compartilhando meu cardápio com você!';
    const corpo = `Clique aqui para ver meu cardápio: ${url}`;
    const linkEmail = `mailto:?subject=${assunto}&body=${corpo}`;
    window.location.href = linkEmail;
    document.body.removeChild(document.querySelector('div[style*="fixed"]'));
}

function copiarLink() {
    const url = window.location.href + "?shared=true#cardapio";
    navigator.clipboard.writeText(url).then(() => {
        alert('Link copiado com sucesso!');
    });
    document.body.removeChild(document.querySelector('div[style*="fixed"]'));
}

if (window.location.search.includes("shared=true")) {
    document.addEventListener("DOMContentLoaded", function () {
        const adminButton = document.querySelector("#admin");
        const cardapioButton = document.querySelector("#cardapio");
        const voltarAdminButton = document.querySelector("#cardapio button[onclick='voltarAdmin()']");

        adminButton.classList.add('hidden');
        login.classList.add('hidden');
        cardapio.classList.remove('hidden');
        btnSair.classList.add('hidden');

        if (voltarAdminButton) {
            voltarAdminButton.style.display = "none";
        }

        const mostrarCarrinhoButton = document.createElement('button');
        mostrarCarrinhoButton.textContent = 'Mostrar Carrinho';
        mostrarCarrinhoButton.onclick = mostrarCarrinho;
        cardapio.appendChild(mostrarCarrinhoButton);

        renderizarCardapio();
    });
}

function toggleTroco() {
    const pagamento = document.querySelector('input[name="pagamento"]:checked').value;
    const trocoPara = document.getElementById('trocoPara');
    if (pagamento === 'dinheiro') {
        trocoPara.classList.remove('hidden');
    } else {
        trocoPara.classList.add('hidden');
    }
}

function toggleEndereco() {
    const entregaRetirada = document.querySelector('input[name="entregaRetirada"]:checked').value;
    const enderecoCampos = document.getElementById('enderecoCampos');

    if (entregaRetirada === 'entrega') {
        enderecoCampos.classList.remove('hidden');
    } else {
        enderecoCampos.classList.add('hidden');
    }
}
function mostrarPedidosAdmin() {
    admin.classList.add('hidden');
    telaPedidos.classList.remove('hidden');
    renderizarPedidosAdmin();
}

function renderizarPedidosAdmin() {
    const listaPedidos = document.getElementById('listaPedidos');
    listaPedidos.innerHTML = '';

    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    if (pedidos.length === 0) {
        const div = document.createElement('div');
        div.textContent = 'Nenhum pedido encontrado.';
        listaPedidos.appendChild(div);
    } else {
        const botaoExcluirTodos = document.createElement('button');
        botaoExcluirTodos.textContent = 'Excluir Todos os Pedidos';
        botaoExcluirTodos.onclick = excluirTodosPedidos;
        listaPedidos.appendChild(botaoExcluirTodos);

        pedidos.forEach((pedido, index) => {
            const div = document.createElement('div');
            div.innerHTML = `
                <h3>Pedido #${index + 1}</h3>
                <p>Nome do cliente: ${pedido.nomeCliente}</p>
                <p>Forma de pagamento: ${pedido.pagamento}</p>
                <p>Entrega/Retirada: ${pedido.entregaRetirada}</p>
                <p>Endereço: ${pedido.endereco}</p>
                <p>Itens do pedido:</p>
                <ul>
                    ${pedido.itens.map(item => `
                        <li>
                            ${item.produto} x ${item.quantidade}
                            <br>
                            Itens: ${item.itens}
                            <br>
                            Observação: ${item.observacao}
                            <br>
                            Preço: R$ ${item.preco * item.quantidade}
                        </li>
                    `).join('')}
                </ul>
                <button onclick="imprimirPedido(${index})">Imprimir Pedido</button>
            `;
            listaPedidos.appendChild(div);
        });
    }
}

function excluirTodosPedidos() {
    if (confirm("Tem certeza que deseja excluir todos os pedidos?")) {
        localStorage.removeItem('pedidos');
        renderizarPedidosAdmin();
    }
}

function imprimirPedido(index) {
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const pedido = pedidos[index];

    const conteudo = `
        <h3>Pedido #${index + 1}</h3>
        <p>Nome do cliente: ${pedido.nomeCliente}</p>
        <p>Forma de pagamento: ${pedido.pagamento}</p>
        <p>Entrega/Retirada: ${pedido.entregaRetirada}</p>
        <p>Endereço: ${pedido.endereco}</p>
        <p>Itens do pedido:</p>
        <ul>
            ${pedido.itens.map(item => `
                <li>
                    ${item.produto} x ${item.quantidade}
                    <br>
                    Itens: ${item.itens}
                    <br>
                    Observação: ${item.observacao}
                    <br>
                    Preço: R$ ${item.preco * item.quantidade}
                </li>
            `).join('')}
        </ul>
    `;

    const janela = window.open('', '_blank');
    janela.document.write(conteudo);
    janela.print();
    janela.close();
}

function voltarAdminPedidos() {
    telaPedidos.classList.add('hidden');
    admin.classList.remove('hidden');
}
