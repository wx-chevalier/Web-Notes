<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>
      {{ msg }}
    </h1>
    <image-form></image-form>
    <images></images>
    <div class="credit">Lazy loading was done with <a href="https://github.com/ooade/pimg">PIMG</a></div>
  </div>
</template>

<script>
  import ImageForm from '../components/image-form.vue'
  import Images from '../components/images.vue'

  export default {
    name: 'app',

    components: {
      ImageForm,
      Images
    },

    data() {
      return {
        msg: 'Image Gallery'
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

.credit {
	padding: 2rem;
}

.credit > a {
	font-size: inherit;
	display: initial;
	margin: initial;
}

a {
	color: #42b983;
}

h1,
h2 {
	font-weight: normal;
}

div > a {
	display: block;
	font-size: 20px;
	margin: 10px;
}
</style>
