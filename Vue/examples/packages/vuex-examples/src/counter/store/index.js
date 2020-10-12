import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		count: 0
	},
	mutations: {
		add(state, payload) {
			// If we get a payload, add it to count
			// Else, just add one to count
			payload ? (state.count += payload) : state.count++;
		},
		subtract(state, payload) {
			payload ? (state.count -= payload) : state.count--;
		}
	},
	actions: {
		addThreeAsync({ commit }) {
			setTimeout(() => commit('add', 3), 3000);
		}
	}
});
