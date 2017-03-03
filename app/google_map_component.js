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
        <button class="btn btn-danger" v-on:click="tweets.clearMap()">\
            <span class="glyphicon glyphicon-repeat" aria-hidden="true"></span>\
             RESET\
        </button>\
    </div>',
    data: ()=> {
        return {
            tweets: tweets
        };
    }
});


// LEFT_BOTTOM Component: key words search bar
Vue.component('left-bottom-control', {
    template: '\
    <form id="search-form" clas="form-inline">\
        <div class="form-group">\
            <input type="text" class="form-control" placeholder="keywords"/>\
            <button type="submit" class="btn btn-default">filter</button>\
        </div>\
    </form>'
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

