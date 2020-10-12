import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// get components
import products from '../components/products.vue'
import cart from '../components/cart.vue'

// initialize router with the respective routes
export default new Router({
	mode: 'history',
	routes: [
		{
			component: products,
			path: '/products'
		},
		{
			component: cart,
			path: '/cart'
		}
	]
})
