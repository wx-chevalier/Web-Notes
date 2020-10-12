<template>
	<div>
		<form enctype="multipart/form-data"
		      @submit.prevent="uploadImages">
			<input id="file"
			       multiple
			       type="file"
			       accept="image/*"
			       @change="tempSaveImages" />
			<button> Add Image</button>
			<br/><br/>
			<div v-show="loading">
				loading..... <br/>
				<img src="https://res.cloudinary.com/stackpie/image/upload/v1506528808/831_m5ttna.gif" />
			</div>
		</form>
	</div>
</template>

<script>
	import { mapActions, mapMutations, mapState } from 'vuex';

	export default {
		computed: mapState(['loading']),
		methods: { ...mapActions(['uploadImages']), ...mapMutations(['tempSaveImages']) }
	}
</script>
