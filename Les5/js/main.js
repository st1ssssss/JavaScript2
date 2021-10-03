const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';

// Переделать в ДЗ не использовать fetch а Promise
let getRequest = (url) => {
  return new Promise((resolve, reject) => {
    if (url) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'json'
      xhr.send();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status !== 200) {
            console.log('Error');
          } else {
            resolve(xhr.response);
          }
        }
      }
    } else reject('url не был передан')
  });
}



class ProductList {
  #goods;
  #allProducts;

  constructor(basket, container = '.products') {
    this.container = container;
    this.searchLine = '.searchForm'
    this.#goods = [];
    this.#allProducts = [];
    this.filteredGoods = [];
    this.basket = basket

    this._fetchGoods();
    /*this.#getProducts().then((data) => {
      this.#goods = data;
      this.#render();
    });*/

  }
  setEventHandlers() {
    document.querySelector(this.container).addEventListener('click', (event) => {
      if (event.target.classList.contains('buy-btn')) {
        this.basket.addToCart(event.target);

      }
    });
    document.querySelector(this.basket.container).addEventListener('click', (event) => {
      if (event.target.classList.contains('del-btn')) {
        this.basket.deleteFromBasket(event.target);
      }
    })

    document.querySelector(this.searchLine).addEventListener('click', (event) => {
      if (event.target.classList.contains('search-btn')) {
        this.filterGoods();
      }
    })

    document.querySelector('.cart').addEventListener('click', event => {
      if (event.target.classList.contains('btn-cart')) {
        this.basket.isVisibleCart()
      }
    })
  }


  filterGoods() {
    let productToFilter = document.getElementsByTagName('input')[0].value;
    let productToFind = this.#goods.find(item => item.product_name === productToFilter);
    if (productToFind) {
      this.filteredGoods = []
      this.filteredGoods.push(productToFind);
      console.log(this.filteredGoods)


    } else {
      console.log('product not found')
    }
  }

  _fetchGoods() {
    getRequest(`${API}/catalogData.json`).then((data) => {
      this.#goods = data;
      this.#render();
    })

  }

  /*#getProducts() {
    return fetch(`${API}/catalogData.json`)
      .then(response => response.json())
      .catch((error) => {
        console.log(error);
      });
  }*/

  sum() {
    return this.#allProducts.reduce((sum, { price }) => sum + price, 0);
  }

  #render() {
    const block = document.querySelector(this.container);
    this.setEventHandlers();
    for (let product of this.#goods) {
      const productObject = new ProductItem(product);

      this.#allProducts.push(productObject);

      block.insertAdjacentHTML('beforeend', productObject.getGoodHTML());

    }
    console.log(this.sum())

  }
}

class ProductItem {
  constructor(product, img = 'https://via.placeholder.com/200x150') {
    this.title = product.product_name;
    this.price = product.price;
    this.id = product.id_product;
    this.img = img;
  }

  getGoodHTML() {
    return `<div class="product-item" data-id="${this.id}">
              <img src="${this.img}" alt="Some img">
              <div class="desc">
                  <h3>${this.title}</h3>
                  <p>${this.price} \u20bd</p>
                  <button class="buy-btn" data-id="${this.id}"
                  data-name="${this.title}"
                  data-price="${this.price}">Купить</button>
              </div>
            </div>`;
  }
}



class CartList {
  constructor(container = '.invCart') {
    this.container = container
    this.cartGoods = [];
    this.cart = [];
    this.newGoods = [];
    this.getBasket();
  }

  getBasket() {
    getRequest(`${API}/getBasket.json`).then((data) => {
      this.cart = data
      this.cartGoods = data.contents;
      this.render()
    })
  }

  isVisibleCart() {
    document.querySelector('.invCart').classList.toggle('isVisible')
  }

  render() {
    const cartBlock = document.querySelector(this.container);
    cartBlock.innerHTML = ''
    for (const good of this.cartGoods) {
      const cartObject = new CartItem(good);

      cartBlock.insertAdjacentHTML('beforeend', cartObject.render())
    }
  }

  addToCart(element) {
    getRequest(`${API}/addToBasket.json`).then(data => {
      if (data.result === 1) {
        let productToAdd = +element.dataset['id'];
        let findProduct = this.cartGoods.find(item =>
          item.id_product === productToAdd)
        if (findProduct) {
          findProduct.quantity++;
          this.updateCart(findProduct)
        } else {
          let product = {
            id_product: productToAdd,
            price: +element.dataset['price'],
            product_name: element.dataset['name'],
            quantity: 1
          };
          this.cartGoods.push(product);
          this.render();
        }
      } else return console.log('eRROR')
    }
    )
  }

  deleteFromBasket(element) {
    getRequest(`${API}/deleteFromBasket.json`).then(data => {
      if (data.result === 1) {
        let productToDelete = +element.dataset['id'];
        let findProduct = this.cartGoods.find(item => item.id_product === productToDelete)
        if (findProduct.quantity > 1) {
          findProduct.quantity--;
          this.updateCart(findProduct);
        } else {
          this.cartGoods.splice((this.cartGoods.indexOf(findProduct)), 1)
          document.querySelector(`.cart-item[data-id="${productToDelete}"]`).remove()
          this.render()
        }
      } else {
        alert('Errorrrrr')
      }
    })
  }


  updateCart(product) {
    let updated = document.querySelector(`.cart-item[data-id="${product.id_product}"]`);
    updated.querySelector(`.product-quantity`).textContent = `Количество: ${product.quantity}`;
    updated.querySelector(`.product-price`).textContent = `${product.price * product.quantity} за ед.`
  }
}



class CartItem {
  constructor(el, img = 'https://via.placeholder.com/50x100') {
    this.img = img
    this.title = el.product_name;
    this.price = el.price;
    this.id = el.id_product;
    this.quantity = el.quantity;
  }
  render() {
    // this.innerHTML = ''
    return `<div class="cart-item" data-id="${this.id}">
            <div class="product-bio">
            <img src="${this.img}" alt="Some image">
            <div class="product-desc">
            <p class="product-title">${this.title}</p>
            <p class="product-quantity">Количество: ${this.quantity}</p>
        <p class="product-single-price">${this.price} за ед.</p>
        </div>
        </div>
        <div class="right-block">
            <p class="product-price">${this.quantity * this.price} ₽</p>
            <button class="del-btn" data-id="${this.id}">&times;</button>
        </div>
        </div>`
  }
}
/*
const app = new Vue({
  el: '#app',
  data: {
    goods: [],
    filteredGoods: [],
    searchLine: '',
  },

  methods: {
    vueGetRequest(url) {
      return fetch(url).then(response => response.json())
        .catch(error => console.log(error))
    },

    filterGoods() {
      let productToFilter = document.getElementsByClassName('search-line').value;
      let productToFind = this.goods.find(item => item.product_name === productToFilter);
      if (productToFind) {
        this.filteredGoods.push(productToFind);
        console.log(this.filteredGoods)
      }
    }
  },


  mounted() {
    this.vueGetRequest(`${API}/catalogData.json`).then(goods => {
      this.goods = goods;
      this.filteredGoods = goods;
    })
  }
})
*/
new ProductList(new CartList());
