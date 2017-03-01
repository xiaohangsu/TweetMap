import googleMap from './google_map';
import chunk from './request_public_tweet';
export default (()=> {
	this.label = "ABCDEFGHIJKLMNOPQRSTUVWSYZ";
	this.locations = [];

	this.markers = this.locations.map((location, i)=> {
	return new google.maps.Marker({
		position: location,
		label: this.label[i * this.label.length]
	});
}),
	this.markerCluster = new MarkerClusterer(googleMap, this.markers,
	{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'})
	return this;
})();
