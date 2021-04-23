import Vue from 'vue'
import axios from 'axios'

import store from '../store'

export default (to, from, next) => {
	// verify token ;)
	axios
		.get('/auth/verify', { headers: { auth: localStorage.token } })
		.then(res => {
			// user is auth :)
			store.commit('AuthUser')
			next()
		})
		.catch(err => {
			// send user to login page :(
			next('/login')
		})
}
