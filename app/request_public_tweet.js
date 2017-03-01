import googleMap from './google_map';
import googleMapMarker from './google_map_marker';
var markerCluster = {};
var lastId = "";
var tweetReq = new XMLHttpRequest();

var tweets = {
	markers: [],
	infoWindows: []
};

var infoWindowsContent = (json)=> {
	let content = '<div class="content">'+
		'<div class="siteNotice">'+
		'</div>'+
		'<div><img src=' + json.user["profile_image_url"] + '/>'+
		json.user["screen_name"] + '</div>' +
		'<div class="bodyContent">'+
		'<p>' + json.text + '</p>'+
		'<p>'+ json["created_at"] +
		'</p>'+
		'</div>'+
		'</div>';
		return content;
}

var openInfoWindow = (id) => {
	tweets.infoWindows[id].open(googleMap, tweets.markers[id]);
}

tweetReq.onload = ()=> {
	let json = JSON.parse(tweetReq.responseText);
	for (let i in json) {
		let latlng = {lat: json[i]['coordinates'][1], lng: json[i]['coordinates'][0]};
		let marker = new google.maps.Marker({
			position: latlng,
			map: googleMap
		});
		tweets.markers.push(marker);
		marker.setMap(googleMap);
		markerCluster = new MarkerClusterer(googleMap, tweets.markers,
		{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
		lastId = json[i].id;

		// info window
		let infoWindow = new google.maps.InfoWindow({
			content: infoWindowsContent(json[i]),
			maxWidth: 200
		});
		tweets.infoWindows.push(infoWindow);
		let len = tweets.markers.length;
		marker.addListener('click', (event)=>{
			openInfoWindow(len - 1);
 		});
	}

}



setInterval(()=> {
	console.log("lastId", lastId);
	tweetReq.open("GET", "/tweet/" + (lastId == "" ? "null" : lastId));
	tweetReq.send();
}, 2500);

export default tweets;