import Vue from './vue';
import googleMap from './google_map';
import googleMapStyle from './google_map_style';
import tweets from './request_public_tweet';

for (let i in googleMapStyle.ids) {
    googleMap.mapTypes.set(googleMapStyle.ids[i],
        new google.maps.StyledMapType(
            googleMapStyle[googleMapStyle.ids[i]], {name: googleMapStyle.ids[i]}));
    googleMap.setMapTypeId(googleMapStyle.ids[i]);
}

googleMap.setMapTypeId('Aubergine');




// x is object
let x = {
    searchText: '',
    distance: '',
    isSearchText: false,
    isSearchDis: false,
    isSelectPoint: false,
    coordinates: [],
    circle: new google.maps.Circle({
        strokeColor: '#3a87ea',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#f1dbb9',
        fillOpacity: 0.35,
        map: googleMap
    })
};

googleMap.addListener('click', (event)=> {
    if (x.isSearchDis) {
        let coordinate = [event.latLng.lat(), event.latLng.lng()];
        x.isSelectPoint = true;
        x.isSearchText = false;
        x.isSearchDis = false;
        x.coordinates = [coordinate[0].toFixed(2), coordinate[1].toFixed(2)];
        tweets.searchDis(x.distance, coordinate);
        x.circle.setCenter({
            lat: coordinate[0],
            lng: coordinate[1]
        });
        x.circle.setRadius(parseInt(x.distance) * 1000);
        x.circle.setMap(googleMap);
    }
});

// define component

// MID CONTROL V1 show tweets counts:
Vue.component('mid-control', {
    template: '\
    <div class="bg-info"> \
        <p>tweets: {{tweets.getTweetsCount()}}</p>\
    </div>',
    data: ()=> {
        return {
            tweets: tweets
        };
    }
});

// BOTTOM CENTER, CONTROL CLEAR AND RESET
Vue.component('bottom-control', {
    template: '\
    <div>\
        <button class="btn btn-danger" v-on:click="reset()" v-show="!x.isSearchDis && !x.isSearchText && !x.isSelectPoint">\
            <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span>\
             CLEAR\
        </button>\
        <button class="btn btn-warning" v-on:click="reset()" v-show="x.isSearchDis || x.isSearchText || x.isSelectPoint">\
            <span class="glyphicon glyphicon-share-alt" aria-hidden="true"></span>\
             BACK\
        </button>\
    </div>',
    data: ()=> {
        return {
            tweets: tweets,
            x: x
        };
    },
    methods: {
        reset: ()=> {
            tweets.reset();
            x.distance = '';
            x.searchText = '';
            x.isSearchDis = false;
            x.isSearchText = false;
            x.isSelectPoint = false;
            x.circle.setMap(null);

        }
    }
});

// TOP_RIGHT Component: key words search bar
Vue.component('top-right-control', {
    template: '<div>\
        <div id="search-form">\
            <div class="input-group search-bar" v-show="!x.isSearchDis && !x.isSearchText && !x.isSelectPoint">\
                <span class="input-group-addon" id="basic-addon1">Keywords</span>\
                <input type="text" class="form-control" placeholder="keywords" v-model="x.searchText" aria-describedby="basic-addon1"/>\
                <button class="btn" v-bind:class="{\'btn-default\': !x.isSearchText, \'btn-success\': x.isSearchText}" v-on:click="search()" type="button">\
                    <span class="glyphicon glyphicon-search"></span></button>\
            </div>\
            <div class="input-group search-bar" v-show="!x.isSearchDis && !x.isSearchText && !x.isSelectPoint">\
                <span class="input-group-addon" id="basic-addon2">Distances</span>\
                <input type="text" class="form-control" placeholder="/km" v-model="x.distance" aria-describedby="basic-addon2"/>\
                <button class="btn" v-bind:class="{\'btn-default\': !x.isSelectPoint, \'btn-success\': x.isSelectPoint}" v-on:click="searchDis()" type="button">\
                    <span class="glyphicon glyphicon-record"></span>\
                </button>\
            </div>\
        </div>\
        <div class="input-group" v-show="x.isSearchDis && !x.isSearchText && !x.isSelectPoint">\
            <div class="alert alert-warning" role="alert">Select A point on Map</div>\
        </div>\
        <div class="input-group" v-show="!x.isSearchDis && x.isSearchText && !x.isSelectPoint">\
            <div class="alert alert-success" role="alert">Search Keywords: {{ x.searchText }}</div>\
        </div>\
        <div class="input-group" v-show="!x.isSearchDis && !x.isSearchText && x.isSelectPoint">\
            <div class="alert alert-success" role="alert">Show point ({{x.coordinates[0] + ", " + x.coordinates[1]}}) with distance: {{ x.distance }}</div>\
        </div>\
    <div>',
    data: ()=> {
        return {
            tweets: tweets,
            x: x
        };
    },
    methods: {
        search: ()=> {
            tweets.search(x.searchText);
            x.isSearchText = true;
            x.isSearchDis = false;
            x.isSelectPoint = false;
        },
        searchDis: ()=> {
            x.isSearchDis = true;
            x.isSearchText = false;
            x.isSelectPoint = false;
        }
    }
});



new Vue({
    el: '#mid-control'
});

new Vue({
    el: '#bottom-control'
});

new Vue({
    el: '#top-right-control'
});

let midControlDiv = document.getElementById('mid-control');
let bottomControlDiv = document.getElementById('bottom-control');
let topRightControlDiv = document.getElementById('top-right-control');

midControlDiv.index = 1;
bottomControlDiv.index = 1;
topRightControlDiv.index = 1;

googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(midControlDiv);
googleMap.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(bottomControlDiv);
googleMap.controls[google.maps.ControlPosition.TOP_RIGHT].push(topRightControlDiv);

