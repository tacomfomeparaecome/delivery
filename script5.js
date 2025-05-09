const btnSeletorCor = document.getElementById('btn-seletor-cor');
const seletorCor = document.getElementById('seletor-cor');
const btnSair = document.getElementById('btnSair');
const login = document.getElementById('login');
const admin = document.getElementById('admin');
const logoInput = document.getElementById('logoInput');
const logoImg = document.getElementById('logoImg');
const h1 = document.querySelector('h1');
const btnMudarCorFonte = document.getElementById('btn-mudar-cor-fonte');
const seletorCorFonte = document.getElementById('seletor-cor-fonte');
const btnMudarFonte = document.getElementById('btn-mudar-fonte');
const seletorFonte = document.getElementById('seletor-fonte');
const btnMudarCorBotoes = document.getElementById('btn-mudar-cor-botoes');
const seletorCorBotoes = document.getElementById('seletor-cor-botoes');
const detalhesPedido = document.getElementById('detalhesPedido');
const telaPedidos = document.getElementById('telaPedidos');

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

btnSeletorCor.addEventListener('click', function () {
  seletorCor.click();
});

seletorCor.addEventListener('input', function () {
  document.body.style.backgroundColor = seletorCor.value;
  salvarAlteracoes();
});

btnMudarCorFonte.addEventListener('click', function () {
  seletorCorFonte.click();
});

seletorCorFonte.addEventListener('input', function () {
  h1.style.color = seletorCorFonte.value;
  salvarAlteracoes();
});

btnMudarFonte.addEventListener('click', function () {
  seletorFonte.style.display = "block";
});

seletorFonte.addEventListener('change', function () {
  h1.style.fontFamily = seletorFonte.value;
  seletorFonte.style.display = "none";
  salvarAlteracoes();
});

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

btnMudarCorBotoes.addEventListener('click', function () {
  seletorCorBotoes.click();
});

seletorCorBotoes.addEventListener('input', function () {
  document.querySelectorAll('button').forEach(botao => {
    botao.style.backgroundColor = seletorCorBotoes.value;
  });
  salvarAlteracoes();
});

function logar() {
  const usuario = document.getElementById('usuario').value;
  const senha = document.getElementById('senha').value;
  if (usuario === 'admin' && senha === '1234') {
    login.classList.add('hidden');
    document.getElementById('navegacao').style.display = 'block';
    btnSair.classList.remove('hidden');
  } else {
    alert('Usuário ou senha inválidos!');
  }
}

function logout() {
  login.classList.remove('hidden');
  admin.classList.add('hidden');
  document.getElementById('navegacao').style.display = 'none';
  btnSair.classList.add('hidden');
  document.getElementById('usuario').value = '';
  document.getElementById('senha').value = '';
  cadastroProduto.classList.add('hidden');

  document.getElementById('btnIrCardapio').classList.add('hidden');
  document.getElementById('btnCompartilhar').classList.add('hidden');
  atualizarCarrinho();
}

function salvarAlteracoes() {
  localStorage.setItem('corFundo', document.body.style.backgroundColor);
  localStorage.setItem('corFonte', h1.style.color);
  localStorage.setItem('fonte', h1.style.fontFamily);
  localStorage.setItem('corBotoes', seletorCorBotoes.value);
}

function carregarAlteracoes() {
  if (localStorage.getItem('corFundo')) {
    document.body.style.backgroundColor = localStorage.getItem('corFundo');
    seletorCor.value = localStorage.getItem('corFundo');
  }
  if (localStorage.getItem('corFonte')) {
    h1.style.color = localStorage.getItem('corFonte');
    seletorCorFonte.value = localStorage.getItem('corFonte');
  }
  if (localStorage.getItem('fonte')) {
    h1.style.fontFamily = localStorage.getItem('fonte');
    seletorFonte.value = localStorage.getItem('fonte');
  }
  if (localStorage.getItem('corBotoes')) {
    document.querySelectorAll('button').forEach(botao => {
      botao.style.backgroundColor = localStorage.getItem('corBotoes');
    });
    seletorCorBotoes.value = localStorage.getItem('corBotoes');
  }
}

document.addEventListener('DOMContentLoaded', carregarAlteracoes);

/* compartilhar cardapio*/
function compartilharCardapio() {
  const menuCompartilhar = document.createElement('div');
  menuCompartilhar.innerHTML = `
      <h2>Compartilhar Cardápio</h2>
      <button onclick="compartilharNoWhatsApp()">Compartilhar no WhatsApp</button>
      <button onclick="compartilharNoFacebook()">Compartilhar no Facebook</button>
      <button onclick="compartilharNoTwitter()">Compartilhar no Twitter</button>
      <button onclick="compartilharPorEmail()">Compartilhar por e-mail</button>
      <button onclick="copiarLink()">Copiar link</button>
      <button onclick="voltarAoAdminCompartilhar()">Voltar Tela Navegação</button>
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
  if (localStorage.getItem('corBotoes')) {
    menuCompartilhar.querySelectorAll('button').forEach(botao => {
      botao.style.backgroundColor = localStorage.getItem('corBotoes');
    });
  }
}

function voltarAoAdminCompartilhar() {
  document.body.removeChild(document.querySelector('div[style*="fixed"]'));
  document.getElementById('navegacao').style.display = 'block';
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


const btnCadastroProduto = document.getElementById('cadastro-produto');
const cadastroProduto = document.querySelector('.cadastro-produto');

btnCadastroProduto.addEventListener('click', function () {
  admin.classList.add('hidden');
  cadastroProduto.classList.remove('hidden');
});

function voltarParaTelaNavegacao() {
  admin.classList.add('hidden');
  cadastroProduto.classList.add('hidden');
  document.getElementById('navegacao').style.display = 'block';
}

const voltarBtn = document.createElement('button');
voltarBtn.textContent = 'Voltar para Tela de Navegação';
voltarBtn.onclick = voltarParaTelaNavegacao;
admin.appendChild(voltarBtn);
if (localStorage.getItem('corBotoes')) {
  voltarBtn.style.backgroundColor = localStorage.getItem('corBotoes');
}
function abrirConfiguracoes() {
  admin.classList.remove('hidden');
  cadastroProduto.classList.add('hidden');
  document.getElementById('navegacao').style.display = 'none';
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
      <div>
        <h2>Editar Produto</h2>
        <input type="text" id="nome-produto-editar" placeholder="Nome do produto">
        <input type="text" id="preco-produto-editar" placeholder="Preço do produto">
        <textarea id="itens-produto-editar" placeholder="Itens do produto"></textarea>
        <select id="categoria-produto-editar"></select>
        <button onclick='salvarEdicaoProduto(${JSON.stringify(produto)})'>Salvar</button>
        <button onclick='fecharModalEditarProduto()'>Fechar</button>
      </div>
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

  modalEditarProduto.style.display = 'flex';
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




function mostrarCardapio() {
  admin.classList.add('hidden');
  cardapio.classList.remove('hidden');
  renderizarCardapio();
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
function voltarAdmin() {
  cardapio.classList.add('hidden');
  document.getElementById('navegacao').style.display = 'block';
  admin.classList.add('hidden'); // Adicione essa linha para ocultar a tela de configurações
}

function fecharCarrinho() {
  carrinhoModal.style.display = 'none';
}
function adicionarAoCarrinho(produto) {
  const modal = document.createElement('div');
  modal.innerHTML = `
    <h2>Adicionar ao Carrinho</h2>
    <label>Quantidade:</label>
    <input type="number" id="quantidade" value="1">
    <label>Observação:</label>
    <textarea id="observacao"></textarea>
    <button onclick="adicionarAoCarrinhoConfirmar(${JSON.stringify(produto)})">Adicionar</button>
    <button onclick="fecharModalAdicionarAoCarrinho()">Cancelar</button>
  `;
  modal.style.position = 'fixed';
  modal.style.top = '50%';
  modal.style.left = '50%';
  modal.style.transform = 'translate(-50%, -50%)';
  modal.style.background = '#fff';
  modal.style.padding = '20px';
  modal.style.border = '1px solid #ddd';
  modal.style.borderRadius = '10px';
  modal.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.2)';
  document.body.appendChild(modal);
}

function adicionarAoCarrinho(produto) {
  const quantidade = parseInt(prompt("Quantidade:")) || 1;
  const observacao = prompt("Observação (opcional):") || "";
  carrinho.push({
    produto: produto.nome,
    itens: produto.itens,
    observacao: observacao,
    quantidade: quantidade,
    preco: parseFloat(produto.preco)
  });
  atualizarCarrinho();
  alert("Produto adicionado ao carrinho!");
}
function fecharModalAdicionarAoCarrinho() {
  document.body.removeChild(document.querySelector('div[style*="fixed"]'));
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

  if (!nomeCliente) {
    alert('Informe seu nome!');
    return;
  }

  if (entregaRetirada.value === 'entrega' && (!endereco || !bairro || !numero)) {
    alert('Preencha todos os campos de endereço para entrega!');
    return;
  }

  let mensagem = `🍔 *Novo Pedido*\n\n`;
  mensagem += `👤 *Cliente:* ${nomeCliente}\n`;
  if (entregaRetirada.value === 'entrega') {
    mensagem += `📍 *Endereço:* ${endereco}, Nº ${numero}, ${bairro}\n`;
  } else {
    mensagem += `🏃 *Retirada no local*\n`;
  }
  mensagem += `💳 *Pagamento:* ${pagamento.value}\n\n`;

  let total = 0;
  carrinho.forEach((item, index) => {
    const subTotal = item.preco * item.quantidade;
    total += subTotal;
    mensagem += `🍽️ *${item.produto}*\n`;
    mensagem += `📋 ${item.itens}\n`;
    if (item.observacao) {
      mensagem += `📝 Obs: ${item.observacao}\n`;
    }
    mensagem += `🔢 Quantidade: ${item.quantidade}\n💰 Subtotal: R$ ${subTotal.toFixed(2)}\n\n`;
  });

  if (entregaRetirada.value === 'entrega') {
    total += 4.00;
    mensagem += `🚚 *Taxa de Entrega:* R$ 4.00\n`;
  }

  mensagem += `🧾 *Total:* R$ ${total.toFixed(2)}`;

  const numeroWhatsApp = '5532984885431';
  const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(url, '_blank');

  // Adicione o pedido ao localStorage
  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
  pedidos.push({
    nomeCliente: nomeCliente,
    pagamento: pagamento.value,
    entregaRetirada: entregaRetirada.value,
    endereco: endereco,
    itens: carrinho
  });
  localStorage.setItem('pedidos', JSON.stringify(pedidos));

  // Limpar campos após o pedido
  carrinho = [];
  atualizarCarrinho();

  document.getElementById('nomeCliente').value = '';
  document.getElementById('endereco').value = '';
  document.getElementById('bairro').value = '';
  document.getElementById('numero').value = '';
  document.querySelectorAll('input[name="entregaRetirada"]').forEach(i => i.checked = false);
  document.querySelectorAll('input[name="pagamento"]').forEach(i => i.checked = false);
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
  if (!document.getElementById('telaPedidos')) {
    const telaPedidos = document.createElement('div');
    telaPedidos.id = 'telaPedidos';
    telaPedidos.innerHTML = `
      <h2>Pedidos</h2>
      <div id="listaPedidos"></div>
      <button onclick="voltarAdminPedidos()">Voltar</button>
    `;
    document.body.appendChild(telaPedidos);
  }
  document.getElementById('telaPedidos').classList.remove('hidden');
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


let telaAtual = null;

function abrirTela(tela) {
  if (telaAtual) {
    telaAtual.classList.add('hidden');
  }
  tela.classList.remove('hidden');
  telaAtual = tela;
}

function mostrarPedidosAdmin() {
  if (telaAtual && telaAtual.id !== 'telaPedidos') {
    telaAtual.classList.add('hidden');
  }
  admin.classList.add('hidden');
  if (!document.getElementById('telaPedidos')) {
    const telaPedidos = document.createElement('div');
    telaPedidos.id = 'telaPedidos';
    telaPedidos.innerHTML = `
      <h2>Pedidos</h2>
      <div id="listaPedidos"></div>
      <button onclick="voltarAdminPedidos()">Voltar</button>
    `;
    document.body.appendChild(telaPedidos);
  }
  document.getElementById('telaPedidos').classList.remove('hidden');
  telaAtual = document.getElementById('telaPedidos');
  renderizarPedidosAdmin();
}

function voltarAdminPedidos() {
  telaPedidos.classList.add('hidden');
  document.getElementById('navegacao').style.display = 'block';
  admin.classList.add('hidden');
}

let paginaAberta = false;

function abrirPagina(pagina) {
  if (paginaAberta) {
    alert('Por favor, volte para a navegação antes de abrir outra página.');
    return;
  }
  paginaAberta = true;
  document.getElementById('navegacao').style.display = 'none';
  pagina.classList.remove('hidden');
}



// Initialize Firebase
const firebaseConfig = {
  databaseURL: "https://delyvery-2b47e-default-rtdb.firebaseio.com/",
};

firebase.initializeApp(firebaseConfig);

const db = firebase.database();

// Função para salvar dados no Firebase
function salvarDados() {
  const dados = {
    categorias: categorias,
    produtos: produtos,
    pedidos: JSON.parse(localStorage.getItem('pedidos')) || [],
  };

  db.ref('dados').set(dados);
}

// Função para ler dados do Firebase
function lerDados() {
  db.ref('dados').on('value', (snapshot) => {
    const dados = snapshot.val();
    if (dados) {
      categorias = dados.categorias;
      produtos = dados.produtos;
      localStorage.setItem('pedidos', JSON.stringify(dados.pedidos));
      atualizarSelect();
      atualizarSelectProdutos();
      renderizarCardapio();
    }
  });
}

// Chame a função lerDados para carregar os dados do Firebase
lerDados();

// Adicione a função salvarDados ao final da função confirmarPedido
function confirmarPedido() {
  // ...
  salvarDados();
}

// Adicione a função salvarDados ao final da função adicionarProduto
function adicionarProduto() {
  // ...
  salvarDados();
}

// Adicione a função salvarDados ao final da função excluirProduto
function excluirProduto() {
  // ...
  salvarDados();
}

// Adicione a função salvarDados ao final da função adicionarCategoria
function adicionarCategoria() {
  // ...
  salvarDados();
}

// Adicione a função salvarDados ao final da função excluirCategoria
function excluirCategoria() {
  // ...
  salvarDados();
}
