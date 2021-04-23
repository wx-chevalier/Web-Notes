import Vue from 'vue'
import Router from 'vue-router'

import Auth from '../components/auth.vue'
import Protected from '../components/protected.vue'
import RequireAuth from '../components/require_auth'

Vue.use(Router)

const router = new Router({
	mode: 'history',
	routes: [
		{ path: '/auth', component: Auth },
		{
			path: '/protected',
			component: Protected,
			beforeEnter: RequireAuth
		},
		{ path: '/*', component: Auth }
	]
})

import App from './App.vue'
import store from '../store'

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
})
