import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    todos: []
  },
  mutations: {
    addTodo(state, text) {
      state.todos.push({ text });
    },
    removeTodo(state, todo) {
      state.todos.splice(state.todos.indexOf(todo), 1);
    }
  }
});
