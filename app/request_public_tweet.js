import googleMap from './google_map';

class Tweets {
    constructor() {
        let tweetsOnLoadEvent = ()=> {
            if (this.tweetReq.responseText == '') return;

            let json = JSON.parse(this.tweetReq.responseText);
            // process : if is searching text
            console.log(json);

            if (json.data != undefined) {
                if (json.scrollId != undefined) this.scrollId = json.scrollId;
                else this.clearReqInterval();
                this.searchTotal = json.total;
                json = json.data;
            }

            for (let i in json) {
                let latlng = {lat: json[i]['coordinates'][1], lng: json[i]['coordinates'][0]};
                let marker = new google.maps.Marker({
                    position: latlng
                });
                this.lastId = json[i].id;
                this.remainTweets.markers.push(marker);

                marker.addListener('click', ()=>{
                    if (this.lastInfoWindow.close !== undefined) {
                        this.closeInfoWindow(this.lastInfoWindow);
                        this.markerStop(this.lastMarker);
                    }
                    this.getTweetDetail(json[i].id);
                    this.markerBounce(marker);
                });
            }
        };

        let tweetDetailOnLoadEvent = ()=> {
            let json = JSON.parse(this.tweetDetailReq.responseText);
            // info window
            let infoWindow = new google.maps.InfoWindow({
                content: this.infoWindowsContent(json),
                maxWidth: 200
            });
            this.openInfoWindow(infoWindow);
        };


        this.lastId = '';
        this.tweetReq = new XMLHttpRequest();
        this.tweetDetailReq = new XMLHttpRequest();
        this.tweets = {
            markers: []
        };
        this.remainTweets = {
            markers: []
        };

        this.lastInfoWindow = {};
        this.lastMarker = {};

        this.backupTweets = {}; // backup for search text

        this.searchText = '';
        this.distance = '';
        this.searchCoord = [];
        this.scrollId = '';
        this.searchTotal = 0;
        this.isSearch = false;
        this.markerCluster = new MarkerClusterer(googleMap, this.tweets.markers,
        {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
        this.tweetReq.open('GET', '/tweet/' + (this.lastId == '' ? 'null' : this.lastId));
        this.tweetReq.send();



        this.reqInterval = 0;


        this.setReqInterval();
        // animation for adding Tweets
        this.updateTweetsInterval = setInterval(()=> {
            let len = this.remainTweets.markers.length;
            if (len !== 0) {
                for (let i = 0; i < len / 20; i++) {
                    let marker = this.remainTweets.markers[0];
                    this.remainTweets.markers.shift();
                    this.tweets.markers.push(marker);
                    this.markerCluster.addMarker(marker);
                }
            }
        }, 400);


        this.tweetReq.onload = tweetsOnLoadEvent;
        this.tweetDetailReq.onload = tweetDetailOnLoadEvent;
    }

    infoWindowsContent(json) {
        let content =
        '<div class="content">'+
            '<a class="content-top-bar" href ="https://twitter.com/' + json.user.name + '" target="_blank">\
                <div class="content-top-bar-img">\
                    <img src=' + json.user.profileImageUrl + '/>\
                </div>\
                <div class="content-top-bar-name">' +
                    json.user.name +
                '</div>' +
            '</a>' +
            '<div class="content-line"></div>' + 
            '<a class="content-content" href="https://twitter.com/' + json.user.name + '/status/' + json.id + '" target="_blank">'+
                '<p class="content-content-tweet">' + json.text + '</p>'+
                '<p class="content-content-created">'+ (new Date(parseInt(json.createdAt))).toLocaleString() + '</p>'+
            '</a>'+
        '</div>';
        return content;
    }

    getTweetDetail(id) {
        this.tweetDetailReq.open('GET', '/tweetDetail/' + (id == '' ? 'null' : id));
        this.tweetDetailReq.send();
    }


    openInfoWindow(infoWindow) {
        infoWindow.open(googleMap, this.lastMarker);
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

    search(searchText) {
        if (!this.isSearch) {
            this.backupTweets = this.tweets;
        }
        this.isSearch = true;
        if (searchText != '') {
            this.searchText = searchText;
            this.scrollId = '';
            this.tweetReq.open('GET', '/tweet/search/' + this.searchText);
            this.tweetReq.send();
            this.clearMap();
            this.clearReqInterval();
            this.setSearchReqInterval();
        }
    }

    searchDis(dis, coord) {
        if (!this.isSearch) {
            this.backupTweets = this.tweets;
        }
        this.isSearch = true;
        this.scrollId = '';
        this.distance = dis;
        this.searchCoord = coord;
        this.tweetReq.open('GET', '/tweet/searchGeo/' + dis + '/' + coord);
        this.tweetReq.send();
        this.clearMap();
        this.clearReqInterval();
        this.setSearchGeoReqInterval();
    }

    setReqInterval() {
        this.reqInterval = setInterval(()=> {
            this.tweetReq.open('GET', '/tweet/' + (this.lastId == '' ? 'null' : this.lastId));
            this.tweetReq.send();
        }, 10000);
    }

    setSearchReqInterval() {
        this.reqInterval = setInterval(()=> {
            this.tweetReq.open('GET', '/tweet/search/' + this.searchText + '/' + this.scrollId);
            this.tweetReq.send();
        }, 10000);
    }

    setSearchGeoReqInterval(dis, coord) {
        this.reqInterval = setInterval(()=> {
            this.tweetReq.open('GET', '/tweet/searchGeo/' + this.distance + '/' + this.searchCoord + '/' + this.scrollId);
            this.tweetReq.send();
        }, 10000);
    }

    clearReqInterval() {
        clearInterval(this.reqInterval);
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
            markers: []
        };
        this.remainTweets = {
            markers: []
        };
    }

    reset() {
        this.clearMap();
        if (this.isSearch) {
            this.searchText = '';
            this.searchTotal = 0;
            this.scrollId = '';
            this.isSearch = false;
            this.clearReqInterval();
            this.setReqInterval();
            this.remainTweets = this.backupTweets;
            this.backupTweets = {};
        }
    }


    getSearchText() {
        return this.searchText;
    }

}

const tweets = new Tweets();

export default tweets;