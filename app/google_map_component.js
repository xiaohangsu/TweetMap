import Vue from './vue';
Vue.component('map-component', {
	template:
	'<div id="map">\
	</div>'
});

new Vue({
	el: '#map-container'
});