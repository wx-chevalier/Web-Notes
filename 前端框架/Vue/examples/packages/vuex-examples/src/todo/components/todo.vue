<template>
	<div class="todo">
		<form @submit.prevent="addTodo(text); text=''">
			<input
			  type="checkbox"
			  title="mark all"
			  @change="markAllTodo(!markAll); markAll = !markAll"
			/>
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
			>
				<input
				  type="checkbox"
				  title="mark todo"
				  @change="markTodo(todo)"
				  :checked="todo.completed"
				/>
				<span :class="{completed: todo.completed}">{{ todo.text }}</span>
				<button @click="removeTodo(todo)">x</button>
				</li>
		</ul>
		<div>
			<a
			  href="#"
			  @click="clearCompleted"
			> clear completed </a>
		</div>
		show:
		<button @click="visible = 'all'"> all </button>
		<button @click="visible = 'completed'"> completed </button>
		<button @click="visible = 'pending'"> pending </button>
	</div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
	data() {
		return {
			text: '',
			visible: 'all',
			markAll: false
		}
	},

	computed: {
		todos() {
			return this.$store.getters[this.visible]
		},
		...mapGetters(['pending', 'completed', 'all'])
	},

	methods: mapMutations([
		'addTodo',
		'removeTodo',
		'markTodo',
		'markAllTodo',
		'clearCompleted'
	])
}
</script>

<style>
	.todo {
		text-align: left;
		padding: 5px;
		margin: auto;
		transition: all 0.5s;
		max-width: 300px;
	}

	.completed {
		color: #888;
		text-decoration: line-through;
	}

	li {
		display: flex;
		flex-wrap: wrap;
	}

	li>span {
		flex: 1;
		max-width: 250px;
	}
</style>
