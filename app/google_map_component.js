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

googleMap.setMapTypeId('Standard');




// x is object
let x = {
    searchText: '',
    distance: '',
    isSearchText: false,
    isSearchDis: false,
    isSelectPoint: false
};

googleMap.addListener('click', (event)=> {
    if (x.isSearchDis) {
        let coordinate = [event.latLng.lat(), event.latLng.lng()];
        x.isSelectPoint = true;
        x.isSearchText = false;
        x.isSearchDis = false;
        tweets.searchDis(x.distance, coordinate);
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
        <button class="btn btn-danger" v-on:click="reset()">\
            <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span>\
             RESET\
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

        }
    }
});

// LEFT_BOTTOM Component: key words search bar
Vue.component('left-bottom-control', {
    template: '\
    <div id="search-form" clas="form-inline">\
        <div class="input-group">\
            <span class="input-group-addon" id="basic-addon1">Keywords</span>\
            <input type="text" class="form-control" placeholder="keywords" v-model="x.searchText" aria-describedby="basic-addon1"/>\
            <button class="btn" v-bind:class="{\'btn-default\': !x.isSearchText, \'btn-success\': x.isSearchText}" v-on:click="search()">Search</button>\
        </div>\
        <div class="input-group" v-show="!x.isSearchDis">\
            <span class="input-group-addon" id="basic-addon2">Distances</span>\
            <input type="text" class="form-control" placeholder="/km" v-model="x.distance" aria-describedby="basic-addon2"/>\
            <button class="btn" v-bind:class="{\'btn-default\': !x.isSelectPoint, \'btn-success\': x.isSelectPoint}" v-on:click="searchDis()">Search</button>\
        </div>\
        <div class="input-group" v-show="x.isSearchDis">\
            <span class="input-group-addon">Select A point on Map</span>\
        </div>\
    </div>',
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
    el: '#left-bottom-control'
});

let midControlDiv = document.getElementById('mid-control');
let bottomControlDiv = document.getElementById('bottom-control');
let leftBottomControlDiv = document.getElementById('left-bottom-control');

midControlDiv.index = 1;
bottomControlDiv.index = 1;
leftBottomControlDiv.index = 1;

googleMap.controls[google.maps.ControlPosition.TOP_CENTER].push(midControlDiv);
googleMap.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(bottomControlDiv);
googleMap.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(leftBottomControlDiv);

