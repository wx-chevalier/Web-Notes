import firebase from 'firebase'
require('firebase/firestore')
import store from './'

firebase.initializeApp({
	apiKey: 'ENTER_API_KEY',
	authDomain: 'ENTER_AUTH_DOMAIN',
	projectId: 'ENTER_PROJECT_ID'
})

const db = firebase.firestore()
const todos = db.collection('todos')

// Getting Real time feeds
todos.onSnapshot(querySnapshot => {
	const myTodos = []
	querySnapshot.forEach(doc => {
		myTodos.push({ id: doc.id, ...doc.data() })
	})
	store.commit('watchTodos', myTodos)
})

export default {
	fetchTodos: () => {
		return todos.get()
	},

	addTodo: text => {
		return todos.add({ text })
	},

	removeTodo: id => {
		return todos.doc(id).delete()
	}
}
