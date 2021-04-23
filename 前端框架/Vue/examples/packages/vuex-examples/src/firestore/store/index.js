import Vue from 'vue';
import Vuex from 'vuex';
import firestore from './firestore';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		todos: []
	},
	mutations: {
		watchTodos(state, todos) {
			state.todos = todos;
		},
		removeTodo(state, todo) {
			state.todos.splice(state.todos.indexOf(todo), 1);
		}
	},
	actions: {
		addTodo({ commit }, text) {
			firestore.addTodo(text);
		},
		removeTodo({ commit }, todo) {
			firestore.removeTodo(todo.id);
			commit('removeTodo', todo);
		}
	}
});
