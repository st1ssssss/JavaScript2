const products = [
  { id: 1, title: 'Notebook', price: 1000 },
  { id: 2, title: 'Mouse', price: 100 },
  { id: 3, title: 'Keyboard', price: 250 },
  { id: 4, title: 'Gamepad', price: 150 },
];

const empty = [
  { id: 0, title: 'nothing', price: 'noPrice' }
];

const renderProduct = (title, price) => {
  return `<div class="product-item">
            <h3>${title}</h3>
            <p>${price}</p>
            <button class="by-btn">Добавить</button>
          </div>`;
};

const productDiv = document.getElementById('products');

const renderProducts = (list = empty) => {
  list.forEach((item) => {
    productDiv.insertAdjacentHTML('beforeend', renderProduct(item.title, item.price));
  });

};

renderProducts(products);
