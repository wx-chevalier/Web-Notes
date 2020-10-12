<template>
	<div id="products">
		<span v-if="products.length === 0">Fetching Products....</span>
		<h2 v-else>Products</h2>
		<div
		  class="notification"
		  v-for="(info, key) in infos"
		  :key="(key)"
		>{{ info }}</div>
	<table :class="{ products: products.length !== 0 }">
		<tr v-show="products.length !== 0">
			<th> Product Name </th>
			<th> Price </th>
			<th> Buy </th>
		</tr>
		<tr
		  v-for="product in products"
		  :key="product.id"
		>
			<td> {{ product.name }} x {{ product.remaining }} </td>
			<td> {{ product.price }} </td>
			<td>
				<button @click="addToCart(product)"> Add to Cart </button>
			</td>
			</tr>
	</table>
	</div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
	data() {
		return {
			infos: []
		}
	},
	mounted() {
		this.fetchProducts();
	},
	computed: mapState(['products']),
	methods: {
		...mapActions(['fetchProducts']),

		addToCart(product) {
			this.$store.commit('addToCart', product)
			const info = product.name + ' added to cart'
			this.infos.push(info)
			setTimeout(() => this.infos.splice(this.infos.indexOf(info), 1), 3000)
		}
	}
}
</script>

<style>
	.products {
		border: 1px solid #ddd;
		margin: auto;
	}

	.products td,
	th {
		border: 1px solid #ddd;
		padding: 10px;
	}

	.notification {
		position: fixed;
		background-color: #ddd;
		padding: 20px;
		width: 200px;
		top: 20vh;
		right: 10vh;
	}

	button {
		border: none;
		cursor: pointer;
		padding: 5px 10px;
	}
</style>
