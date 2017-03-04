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
        this.lastInfoWindow = {};
        this.lastMarker = {};
        this.remainTweets = {
            markers: [],
            infoWindows: []
        };


        this.tweetReq.open('GET', '/tweet/' + (this.lastId == '' ? 'null' : this.lastId));
        this.tweetReq.send();
        this.interval = setInterval(()=> {
            this.tweetReq.open('GET', '/tweet/' + (this.lastId == '' ? 'null' : this.lastId));
            this.tweetReq.send();
        }, 4000);


        // animation for adding Tweets
        this.updateTweetsInterval = setInterval(()=> {
            let len = this.remainTweets.markers.length;
            if (len !== 0) {
                for (let i = 0; i < len / 20; i++) {
                    let marker = this.remainTweets.markers[0];
                    let infoWindows = this.remainTweets.infoWindows[0];
                    this.remainTweets.markers.shift();
                    this.remainTweets.infoWindows.shift();

                    this.tweets.markers.push(marker);
                    marker.setMap(googleMap);
                    this.tweets.infoWindows.push(infoWindows);
                }
            }
        }, 200);

        this.tweetReq.onload = ()=> {
            console.log(this.remainTweets.markers.length);
            let json = JSON.parse(this.tweetReq.responseText);
            for (let i in json) {
                let latlng = {lat: json[i]['coordinates'][1], lng: json[i]['coordinates'][0]};
                let marker = new google.maps.Marker({
                    position: latlng
                });
                this.lastId = json[i].id;
                this.remainTweets.markers.push(marker);

                // info window
                let infoWindow = new google.maps.InfoWindow({
                    content: this.infoWindowsContent(json[i]),
                    maxWidth: 200
                });
                this.remainTweets.infoWindows.push(infoWindow);

                marker.addListener('click', ()=>{
                    if (this.lastInfoWindow.close !== undefined) {
                        this.closeInfoWindow(this.lastInfoWindow);
                        this.markerStop(this.lastMarker);
                    }
                    this.openInfoWindow(infoWindow, marker);
                    this.markerBounce(marker);

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

    openInfoWindow(infoWindow, marker) {
        infoWindow.open(googleMap, marker);
        this.lastInfoWindow = infoWindow;
    }

    markerBounce(marker) {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        this.lastMarker = marker;
    }

    closeInfoWindow(infoWindow) {
        infoWindow.close();
    }

    markerStop(marker) {
        marker.setAnimation(null);
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