<template>
	<div>
		<form @submit.prevent="addTodo">
			<input
			  type="text"
			  placeholder="What must be done?"
			  v-model="text"
			/>
			<button> Add Todo </button>
		</form>
		<ul>
			<li
			  v-for="(todo, index) in todos"
			  :key="index"
			>{{ todo.text }}
				<button @click="removeTodo(todo)">x</button>
				</li>
		</ul>
	</div>
</template>

<script>
import store from '../store';

export default {
	data() {
		return {
			text: ''
		}
	},

	computed: { todos: () => store.state.todos },

	methods: {
		addTodo() {
			store.commit('addTodo', this.text)
			this.text = ''
		},
		removeTodo(id) {
			store.commit('removeTodo', id)
		}
	}
}
</script>
