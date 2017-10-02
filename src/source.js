import Vue from 'vue';
import App from './components/app.vue';
import { VTooltip } from 'v-tooltip';

Vue.directive('tooltip', VTooltip);

Vue.component('app', App);

const app = new Vue({
	data: {

	},

	methods:{

	},
	components:{
		
	},
	render: (c)=> c('app'),
}).$mount('#app');