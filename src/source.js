import Vue from 'vue';
import App from './components/app.vue';
import {Sketch} from 'vue-color';

Vue.component('app', App);

const app = new Vue({
	data: {

	},

	methods:{

	},
	components:{
		'sketch-picker': Sketch,
	},
	render: (c)=> c('app'),
}).$mount('#app');