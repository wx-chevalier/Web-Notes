import Vue from 'vue';
import VueImage from 'pimg/dist/vue';

import App from './App.vue';
import store from '../store';

Vue.component('vue-image', VueImage);

new Vue({
	el: '#app',
	store,
	render: h => h(App)
});
