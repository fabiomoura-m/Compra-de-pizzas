let modalQuantidade = 1;
let cart = [];
let modalKey = 0;

// Listagem das pizzas
pizzaJson.map((item, index) => {
  let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

  document.querySelector('.pizza-area').append(pizzaItem);

  // preenchendo as informações em pizzaitem
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector(
    '.pizza-item--price'
  ).innerHTML = ` R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;
  pizzaItem.setAttribute('data-key', index); // seta o valor do atributo sendo o index de cada elemento

  pizzaItem.querySelector('a').addEventListener('click', e => {
    // prevenindo a ação padrão, que no caso é recarregamento da página
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key'); // pega o elemento mais proximo de "a" que tem a classe .pizza-item e pega o valor do atributo data-key dele.
    modalQuantidade = 1;
    modalKey = key;

    // mostrando o modal
    document.querySelector('.pizzaWindowArea').style.opacity = 0;
    document.querySelector('.pizzaWindowArea').style.display = 'flex';
    setTimeout(() => {
      document.querySelector('.pizzaWindowArea').style.opacity = 1;
    }, 200); //para que a animação de transition especificada no css possa funcionar

    //Preenchendo o modal
    document.querySelector('.pizzaBig img').src = pizzaJson[key].img;
    document.querySelector('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    document.querySelector('.pizzaInfo--desc').innerHTML =
      pizzaJson[key].description;
    document.querySelector(
      '.pizzaInfo--actualPrice'
    ).innerHTML = ` R$ ${pizzaJson[key].price.toFixed(2)}`;
    document
      .querySelector('.pizzaInfo--size.selected')
      .classList.remove('selected'); // remove para resetar o tamanho selecionado ao abrir outro modal
    document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add('selected'); // adicionando para sempre que abrir o modal, o tamanho grande estar selecionado
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    }); //percorre os itens e adiciona os tamanhos

    document.querySelector('.pizzaInfo--qt').innerHTML = modalQuantidade;
  });
});

// Eventos do Modal
function closeModal() {
  document.querySelector('.pizzaWindowArea').style.opacity = 0;
  setTimeout(() => {
    document.querySelector('.pizzaWindowArea').style.display = 'none';
  }, 200);
}
document
  .querySelectorAll('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton')
  .forEach(item => {
    item.addEventListener('click', closeModal);
  }); // fechando modal

document.querySelector('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if (modalQuantidade > 1) {
    modalQuantidade--;
    document.querySelector('.pizzaInfo--qt').innerHTML = modalQuantidade;
  }
});
document.querySelector('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQuantidade++;
  document.querySelector('.pizzaInfo--qt').innerHTML = modalQuantidade;
}); // add qnt de pizza

document.querySelectorAll('.pizzaInfo--size').forEach((size, sizeIndex) => {
  size.addEventListener('click', e => {
    document
      .querySelector('.pizzaInfo--size.selected')
      .classList.remove('selected');
    size.classList.add('selected');
  });
}); // selecionando tamanhos

// Adicionando ao carrinho
document
  .querySelector('.pizzaInfo--addButton')
  .addEventListener('click', () => {
    // Qual a pizza?
    // Qual o tamanho selecionando?
    // Quantas pizzas foram selecionadas?
    let size = parseInt(
      document
        .querySelector('.pizzaInfo--size.selected')
        .getAttribute('data-key')
    );

    let identifier = pizzaJson[modalKey].id + '@' + size;

    let key = cart.findIndex(item => item.identifier == identifier);

    if (key > -1) {
      cart[key].quantidade += modalQuantidade;
    } else {
      cart.push({
        identifier,
        id: pizzaJson[modalKey].id,
        size: size,
        quantidade: modalQuantidade
      });
    }

    closeModal();
  });
