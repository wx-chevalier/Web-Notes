<template>
	<form class="signup-form"
	      @submit.prevent="signup">
		<input type="email"
		       placeholder="email"
		       v-model="email" />
		<input type="password"
		       placeholder="password"
		       v-model="password" />
		<button>Signup</button>
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
			signup() {
				this.$store.dispatch({
					type: 'signup',
					email: this.email,
					password: this.password
				})
				this.email = ''
				this.password = ''
			}
		}
	}
</script>