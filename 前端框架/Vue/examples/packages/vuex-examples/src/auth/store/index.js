import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		authenticated: false,
		authError: null
	},
	mutations: {
		AuthUser(state) {
			state.authenticated = true
			state.authError = null
		},
		AuthError(state, e) {
			state.authError = e
		}
	},
	actions: {
		signin({ commit }, { email, password }) {
			axios
				.post('/auth/signin', {
					email,
					password
				})
				.then(res => saveToken(res.data.token, commit))
				.catch(({ response }) => {
					commit('AuthError', response.data)
				})
		},
		signup({ commit }, { email, password }) {
			axios
				.post('/auth/signup', {
					email,
					password
				})
				.then(res => saveToken(res.data.token, commit))
				.catch(({ response }) => {
					commit('AuthError', response.data)
				})
		}
	}
})

function saveToken(token, cb) {
	localStorage.setItem('token', token)

	// user is auth ^_^
	cb('AuthUser')
}
