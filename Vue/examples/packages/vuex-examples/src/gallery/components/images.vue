<template>
	<ul>
		<li v-for="image in images"
		    :key="image._id">
			<vue-image :src="image.image_url"/>
			<button @click="removeImage(image)">Delete</button>
		</li>
	</ul>
</template>

<script>
	import { mapState, mapMutations, mapActions } from 'vuex'

	export default {
		mounted() {
			this.fetchImages()
		},
		computed: mapState(['images']),
		methods: { ...mapActions(['fetchImages']), ...mapMutations(['removeImage']) }
	}
</script>

<style>
	ul {
		list-style: none;
		display: flex;
		flex-wrap: wrap;
		max-width: 100vw;
	}

	li img {
		display: flex;
		border: 2px solid #bada55;
		flex: 1;
		justify-content: space-around;
		margin: 10px;
	}

	button {
		border: none;
		cursor: pointer;
		padding: 5px 10px;
	}

	li button {
		background-color: crimson;
		color: #fff;
		padding: 10px 20px;
	}

	li button:hover {
		background-color: red;
	}

	.pimg {
		width: 250px;
		height: auto;
	}

	.pimg__placeholder {
		filter: blur(2vw);
		transform: scale(1.05);
	}
</style>

