import Vue from './vue'
import googleMapConfig from './google_map_config';
import googleMap from './google_map';
import googleMapStyle from './google_map_style';
import tweets from './request_public_tweet';
for (var i in googleMapStyle.ids) {
    googleMap.mapTypes.set(googleMapStyle.ids[i],
        new google.maps.StyledMapType(
            googleMapStyle[googleMapStyle.ids[i]], {name: googleMapStyle.ids[i]}));
    googleMap.setMapTypeId(googleMapStyle.ids[i]);
}

googleMap.setMapTypeId('Standard');



// var lastValidCenter = latLngBounds.getCenter();

google.maps.event.addListener(googleMap, 'center_changed', ()=> {
	console.log(googleMap.getCenter().lat());
	// if (latLngBounds.contains(googleMap.getCenter())) {
	// 	lastValidCenter = googleMap.getCenter();
	// }

	// googleMap.panTo(lastValidCenter);
});

// define component

Vue.component('mid-control', {
	template: '\
	<div class="bg-info"> \
		<p>tweets: {{tweets.markers.length}}</p>\
	</div>',
	data: ()=> {
		return {
			tweets: tweets
		}
	}
});

new Vue({
    el: '#mid-control'
});

var midControlDiv = document.getElementById('mid-control');
midControlDiv.index = 1;
googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(midControlDiv);