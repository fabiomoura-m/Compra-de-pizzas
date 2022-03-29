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
    updateCart();
    closeModal();
  });

// mostrar o carrinho de compras no mobile
document.querySelector('.menu-openner').addEventListener('click', () => {
  if (cart.length > 0) {
    document.querySelector('aside').style.left = '0';
  }
});
// fechar carrinho de compras no mobile
document.querySelector('.menu-closer').addEventListener('click', () => {
  document.querySelector('aside').style.left = '100vw';
});

function updateCart() {
  document.querySelector('.menu-openner span').innerHTML = cart.length;
  if (cart.length > 0) {
    document.querySelector('aside').classList.add('show');
    document.querySelector('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for (let i in cart) {
      let pizzaItem = pizzaJson.find(item => item.id == cart[i].id);
      subtotal += pizzaItem.price * cart[i].quantidade;

      let cartItem = document
        .querySelector('.models .cart--item')
        .cloneNode(true);

      document.querySelector('.cart').append(cartItem);

      let pizzaSizeName;
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantidade;
      cartItem
        .querySelector('.cart--item-qtmenos')
        .addEventListener('click', () => {
          if (cart[i].quantidade > 1) {
            cart[i].quantidade--;
          } else {
            cart.splice(i, 1);
          }
          updateCart();
        });
      cartItem
        .querySelector('.cart--item-qtmais')
        .addEventListener('click', () => {
          cart[i].quantidade++;
          updateCart();
        });
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    document.querySelector(
      '.subtotal span:last-child'
    ).innerHTML = `R$ ${subtotal.toFixed(2)}`;
    document.querySelector(
      '.desconto span:last-child'
    ).innerHTML = `R$ ${desconto.toFixed(2)}`;
    document.querySelector(
      '.total span:last-child'
    ).innerHTML = `R$ ${total.toFixed(2)}`;
  } else {
    document.querySelector('aside').classList.remove('show');
    document.querySelector('aside').style.left = '100vw';
  }
}
