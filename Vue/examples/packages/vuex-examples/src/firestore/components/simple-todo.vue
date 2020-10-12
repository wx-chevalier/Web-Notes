<template>
	<div>
		<form @submit.prevent="addTodo(text); text = ''">
			<input type="text"
			       placeholder="What must be done?"
			       v-model="text" />
			<button> Add Todo </button>
		</form>
		<ul>
			<li v-for="todo in todos"
			    :key="todo.id">{{ todo.text }}
				<button @click="removeTodo(todo)">x</button>
			</li>
		</ul>
	</div>
</template>

<script>
	import { mapState, mapActions } from 'vuex'

	export default {
		data() {
			return {
				text: ''
			}
		},
		computed: mapState(['todos']),
		methods: mapActions(['addTodo', 'removeTodo'])
	}
</script>
