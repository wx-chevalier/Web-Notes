<template>
  <div id="app">
    <router-link to="/"><img src="./assets/logo.png"></router-link>
    <h1>
      {{ msg }}
    </h1>
    <router-link to="/products"> products </router-link>
    <router-link to="/cart"> cart </router-link>
    <router-view></router-view>
  </div>
</template>

<script>
import products from '../components/products.vue'
import cart from '../components/cart.vue'

export default {
  name: 'app',

  components: {
    products,
    cart
  },

  data() {
    return {
      msg: 'Shopping Cart'
    }
  }
}
</script>

<style>
  #app {
    transition: all 0.5s;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }

  a {
    color: #42b983;
  }

  h1,
  h2 {
    font-weight: normal;
  }

  div>a {
    display: block;
    font-size: 20px;
    margin: 10px;
  }
</style>
