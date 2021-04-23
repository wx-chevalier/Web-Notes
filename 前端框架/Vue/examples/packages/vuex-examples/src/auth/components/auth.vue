<template>
	<div>
		<div class="error">
			{{ authError }}
		</div>
		<signin />
		<signup />
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import signin from './signin.vue'
	import signup from './signup.vue'

	export default {
		components: {
			signin,
			signup
		},
		computed: mapState(['authError', 'authenticated']),
		watch: {
			authenticated() {
				this.$router.push('/protected')
			}
		}
	}
</script>


<style>
	.error {
		color: red;
	}

	body {
		max-width: 500px;
		text-align: center;
		margin: auto;
	}

	form {
		margin: 20px
	}

	input,
	button {
		display: block
	}
</style>
