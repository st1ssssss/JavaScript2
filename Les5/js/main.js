const API = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses';


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
      let valueGood = document.getElementsByTagName("input")[0].value
      let regExp = new RegExp(valueGood, 'i');
      let productToFind = this.goods.filter(el => regExp.test(el.product_name));
      console.log(productToFind);
    },

    addProduct(product) {
      console.log(product)
    },

    visibleCart() {
      document.querySelector('.invCart').classList.toggle('isVisible');
    }
  },


  mounted() {
    this.vueGetRequest(`${API}/catalogData.json`).then(goods => {
      this.goods = goods;
      this.filteredGoods = goods;
    })
  }
})

//new ProductList(new CartList());
