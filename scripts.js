// scripts.js
document.addEventListener('DOMContentLoaded', () => {
  fetch('veiculos.json')
    .then(res => res.json())
    .then(dados => {
      window.veiculos = dados;
      mostrarVeiculos(dados);
      configurarSliders();
      configurarBusca();
      configurarFormContato();
      configurarFormContrato();
    })
    .catch(() => alert('Erro ao carregar dados dos veículos.'));
});

function mostrarVeiculos(lista) {
  const container = document.getElementById('car-list');
  container.innerHTML = '';
  lista.forEach(v => {
    const card = document.createElement('div');
    card.className = 'car-card';
    card.innerHTML = `
      <img src="${v.imagens[0]}" alt="${v.marca} ${v.modelo}">
      <div>
        <h3>${v.marca} ${v.modelo} (${v.ano})</h3>
        <p>${v.tipo === 'aluguel' ? 'Aluguel: R$ ' + v.preco + '/mês' : 'Venda: R$ ' + v.preco.toLocaleString()}</p>
        <button onclick="selecionarVeiculo(${v.id})">Selecionar</button>
        <button onclick="verGaleria(${v.id})">Galeria</button>
      </div>`;
    container.appendChild(card);
  });
}

// slider price filtering
function configurarSliders() {
  const minEl = document.getElementById('slider-min');
  const maxEl = document.getElementById('slider-max');
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');
  minEl.addEventListener('input', filtrarTudo);
  maxEl.addEventListener('input', filtrarTudo);
  function filtrarTudo() {
    let min = +minEl.value, max = +maxEl.value;
    if (min > max) [min, max] =
     [max, min];
    priceMin.textContent = min;
    priceMax.textContent = max;
    const termo = document.getElementById('search-text').value.toLowerCase();
    const tipo = document.getElementById('search-type').value;
    const filtrados = window.veiculos.filter(v =>
      v.preco >= min && v.preco <= max &&
      (v.marca.toLowerCase().includes(termo) || v.modelo.toLowerCase().includes(termo)) &&
      (tipo ? v.tipo === tipo : true)
    );
    mostrarVeiculos(filtrados);
  }
}

function configurarBusca() {
  document.getElementById('search-form').addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('slider-min').dispatchEvent(new Event('input'));
  });
}

function selecionarVeiculo(id) {
  const v = window.veiculos.find(x => x.id === id);
  if (!v) return;
  document.getElementById('contrato-veiculo').value = `${v.marca} ${v.modelo}`;
  window.location.hash = '#contrato';
}

function configurarFormContato() {
  document.getElementById('form-contato').addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('contato-nome').value;
    document.getElementById('contato-resposta').innerHTML = `Obrigado, <strong>${nome}</strong>! Mensagem enviada com sucesso.`;
    e.target.reset();
  });
}

function configurarFormContrato() {
  document.getElementById('form-contrato').addEventListener('submit', e => {
    e.preventDefault();
    const nome = document.getElementById('cliente-nome').value;
    const email = document.getElementById('cliente-email').value;
    const tel = document.getElementById('cliente-tel').value;
    const veiculo = document.getElementById('contrato-veiculo').value;
    const inicio = document.getElementById('contrato-data-inicio').value;
    const fim = document.getElementById('contrato-data-fim').value;
    if (inicio > fim) return alert('Data de início deve ser antes da data de fim.');
    const txt = `
CONTRATO DE ${veiculo.toUpperCase()}
Locador: Rota Certa
Locatário: ${nome}
E-mail: ${email}
Telefone: ${tel}
Período: de ${inicio} até ${fim}

_____________________       _____________________
Assinatura do Locador      Assinatura do Locatário`;
    document.getElementById('contrato-output').textContent = txt;
    window.location.hash = '#contrato-output';
  });
}

function verGaleria(id) {
  const v = window.veiculos.find(x => x.id === id);
  if (!v) return;
  const urls = v.imagens;
  let gal = window.open('', '_blank', 'width=800,height=600');
  gal.document.write('<title>Galeria</title><body style="margin:0;display:flex;flex-wrap:nowrap;overflow-x:auto;">');
  urls.forEach(u => {
    gal.document.write(`<img src="${u}" style="max-height:100%;margin:5px;">`);
  });
  gal.document.write('</body></html>');
}