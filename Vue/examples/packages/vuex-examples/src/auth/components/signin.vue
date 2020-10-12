<template>
	<form class="signin-form"
	      @submit.prevent="signin">
		<input type="email"
		       placeholder="email"
		       v-model="email" />
		<input type="password"
		       placeholder="password"
		       v-model="password" />
		<button>Signin</button>
	</form>
</template>

<script>
	export default {
		data() {
			return {
				email: '',
				password: ''
			}
		},
		methods: {
			signin() {
				this.$store.dispatch({
					type: 'signin',
					email: this.email,
					password: this.password
				})
				this.email = ''
				this.password = ''
			}
		}
	}
</script>

