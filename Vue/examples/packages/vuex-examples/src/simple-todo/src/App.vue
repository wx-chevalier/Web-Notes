<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h1>{{ msg }}</h1>
    <simpletodo></simpletodo>
  </div>
</template>

<script>
import simpletodo from '../components/simple-todo.vue'

export default {
  name: 'app',

  components: {
    simpletodo
  },

  data() {
    return {
      msg: 'Simple Todo'
    }
  }
}
</script>

<style>
#app {
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

h1 {
  font-weight: normal;
}

h1>a {
  color: inherit;
  text-decoration: none;
}

ul {
  list-style-type: none;
  padding: 0;
}

li>div {
  margin-top: 10px;
}
</style>
