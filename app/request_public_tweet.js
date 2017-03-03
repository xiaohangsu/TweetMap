import googleMap from './google_map';

class Tweets {
    constructor() {
        this.lastId = '';
        this.tweetReq = new XMLHttpRequest();
        this.tweets = {
            markers: [],
            infoWindows: []
        };
        this.markerCluster = new MarkerClusterer(googleMap, this.tweets.markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        this.lastMarkerId = -1;

        this.interval = setInterval(()=> {
            this.tweetReq.open('GET', '/tweet/' + (this.lastId == '' ? 'null' : this.lastId));
            this.tweetReq.send();
        }, 8000);

        this.tweetReq.onload = ()=> {
            let json = JSON.parse(this.tweetReq.responseText);
            for (let i in json) {
                let latlng = {lat: json[i]['coordinates'][1], lng: json[i]['coordinates'][0]};
                let marker = new google.maps.Marker({
                    position: latlng,
                    map: googleMap
                });
                marker.setMap(googleMap);
                this.lastId = json[i].id;
                this.tweets.markers.push(marker);

                // info window
                let infoWindow = new google.maps.InfoWindow({
                    content: this.infoWindowsContent(json[i]),
                    maxWidth: 200
                });
                this.tweets.infoWindows.push(infoWindow);
                let len = this.tweets.markers.length;
                marker.addListener('click', ()=>{
                    if (this.lastMarkerId > 0) {
                        this.closeInfoWindow(this.lastMarkerId);
                        this.markerStop(this.lastMarkerId);
                    }
                    this.openInfoWindow(len - 1);
                    this.markerBounce(len - 1);

                });
            }
            this.markerCluster.addMarkers(this.tweets.markers);
        };

    }

    infoWindowsContent(json) {
        let content =
        '<div class="content">'+
            '<a class="content-top-bar" href ="https://twitter.com/' + json.user['screen_name'] + '" target="_blank">\
                <div class="content-top-bar-img">\
                    <img src=' + json.user['profile_image_url']+ '/>\
                </div>\
                <div class="content-top-bar-name">' +
                    json.user['screen_name'] +
                '</div>' +
            '</a>' +
            '<div class="content-line"></div>' + 
            '<a class="content-content" href="https://twitter.com/' + json.user['screen_name'] + '/status/' + json.id + '" target="_blank">'+
                '<p class="content-content-tweet">' + json.text + '</p>'+
                '<p class="content-content-created">'+ json['created_at'] + '</p>'+
            '</a>'+
        '</div>';
        return content;
    }

    openInfoWindow(id) {
        this.tweets.infoWindows[id].open(googleMap, this.tweets.markers[id]);
        this.lastMarkerId = id;
    }

    markerBounce(id) {
        this.tweets.markers[id].setAnimation(google.maps.Animation.BOUNCE);
    }

    closeInfoWindow(id) {
        this.tweets.infoWindows[id].close();
    }

    markerStop(id) {
        this.tweets.markers[id].setAnimation(null);
    }


    getTweetsCount() {
        return this.tweets.markers.length;
    }

    clearMap() {
        const clearMarkers = ()=> {
            for (let i = 0; i < this.tweets.markers.length; i++) {
                this.tweets.markers[i].setMap(null);
            }
        };

        const clearCluster = ()=> {
            this.markerCluster.clearMarkers();
        };

        clearMarkers();
        clearCluster();
        this.tweets = {
            markers: [],
            infoWindows: []
        };
    }
}

const tweets = new Tweets();

export default tweets;