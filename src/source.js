import Vue from 'vue';
import App from './components/app.vue';
import { VTooltip } from 'v-tooltip';
import SweetModal from 'sweet-modal-vue/src/plugin.js';
Vue.use(SweetModal);   

window.axios = require('axios');
window.FontFaceObserver = require('fontfaceobserver');

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