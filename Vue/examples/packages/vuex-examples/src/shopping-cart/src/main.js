import Vue from 'vue'

import App from './App.vue'
import store from '../store'
import router from './router'

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
})
