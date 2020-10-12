<template>
	<div>
		<h1>{{count}}</h1>
		<button @click="add">Add 1</button>
		<button @click="add2">Add 2</button>
		<button @click="subtract">Subtract 1</button>
		<button @click="subtract(3)">Subtract 3</button>
		<button @click="addThreeAsync">Add 3 after 3s (Async)</button>
	</div>
</template>

<script>
import store from '../store'

export default {
	computed: { count: () => store.state.count },

	methods: {
		add: () => store.commit('add'),
		add2: () => store.commit('add', 2),
		addThreeAsync: () => store.dispatch('addThreeAsync'),
		subtract: (payload) => store.commit('subtract', +payload)
	}
}
</script>

