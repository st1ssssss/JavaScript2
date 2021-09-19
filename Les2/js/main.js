class ProductsList {
  constructor(container = '.products') {
    this.container = container;
    this._goods = [];
    this._goodsObjects = [];
    this.cartGoods = [];

    this._fetchGoods();
    this._render();
    this._countPrice();
    this.setEventHandlers()
  }

  _fetchGoods() {
    this._goods = [
      { id: 1, title: 'Notebook', price: 20000 },
      { id: 2, title: 'Mouse', price: 1500 },
      { id: 3, title: 'Keyboard', price: 5000 },
      { id: 4, title: 'Gamepad', price: 4500 },
    ];
  }

  _render() {
    const block = document.querySelector(this.container);

    for (const product of this._goods) {
      const productObject = new ProductItem(product);
      this._goodsObjects.push(productObject);

      block.insertAdjacentHTML('beforeend', productObject.getHTMLString())
    }

  }

  setEventHandlers() {
    document.querySelector('.products').addEventListener('onclick', (event) => {
      this.addToBasket(event)
    })
  }

  addToBasket(event) {
    if (!event.target.classList.contains('.buy-btn')) return
    else {
      const productId = +event.target.dataset.id;
      const productToAdd = this._goods.find((item) =>
        item.id === productId);
      this.CartList.addToCart(productToAdd);
    }
  }

  _countPrice() {
    let finalPrice = 0;
    this._goodsObjects.forEach(item => {
      finalPrice += item.price;
    })
    console.log(finalPrice)
  }
}

class ProductItem {
  constructor(item, img = 'https://via.placeholder.com/200x150') {
    this.id = item.id;
    this.title = item.title;
    this.price = item.price;
    this.img = img;
  }

  getHTMLString() {
    return `<div class="product-item" data-id="${this.id}">
              <img src="${this.img}" alt="Some img">
              <div class="desc">
                  <h3>${this.title}</h3>
                  <p>${this.price} \u20bd</p>
                  <button data-id="${this.id}" class="buy-btn">Купить</button>
              </div>
          </div>`;
  }
}

const catalog = new ProductsList();

//Классы и методы для корзины

class CartList {
  constructor(container = '.cart') {
    this.container = container
    this.cartGoods = [
      { id: 1, title: 'Notebook', price: 20000 },
      { id: 2, title: 'Mouse', price: 1500 },
    ];

  }

  render() {
    const cartBlock = document.querySelector(this.container);
    for (const good of this.cartGoods) {
      const cartObject = new CartItem(good);
      cartBlock.insertAdjacentHTML('beforeend', cartObject.getHTMLString())
    }
  }

  addToCart(productToAdd) {
    if (productToAdd) {
      const findProduct = this.cartGoods.find(item =>
        productToAdd.id === item.id)
      if (findProduct) {
        findProduct.count++;
        console.log(this.cartGoods);
      } else {
        this.cartGoods.push({ ...productToAdd, count: 1 });
        console.log(this.cartGoods)
      }
    }
  }
}

class CartItem {
  constructor(item) {
    this.id = item.id;
    this.title = item.title;
    this.price = item.price;
    this.count = item.count;
  }

  getHTMLString() {
    return `<div class="cart-item" data-id="${this.id}">
    <div class="desc">
        <h3>${this.title}</h3>
        <p>${this.price} \u20bd</p>
        <p>${this.count}</p>
    </div>
</div>`;
  }
}

const cart = new CartList()