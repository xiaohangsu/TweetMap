import Vue from './vue';
import googleMap from './google_map';
import googleMapConfig from './google_map_config';
import googleMapStyle from './google_map_style';
Vue.component('input-components', {
    template: '\
        <div> \
            <div class="form-group"> \
                <div class="input-group-btn">\
                <button type="button" class="btn btn-default dropdown-toggle" \
                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{{googleMap.mapTypeId}}<span class="caret"></span></button>\
                    <ul class="dropdown-menu">\
                        <li><a href="#" v-for="type in mapTypeId" v-on:click="changeMapType(type)">{{type}}</a></li>\
                    </ul>\
                </div>\
            </div>\
            <div class="form-group"> \
                <label class="col-sm-4 control-label">lat:</label> \
                <div class="col-sm-8"> \
                    <input type="text" v-model="curLatLng.lat" class="form-control" placeholder="latitude" v-on:input="changeLat(curLatLng)"> \
                </div> \
            </div> \
            <div class="form-group"> \
                <label class="col-sm-4 control-label">lng:</label>\
                <div class="col-sm-8">\
                    <input type="text" v-model="curLatLng.lng" class="form-control" placeholder="longitude" v-on:input="changeLng(curLatLng)">\
                </div>\
            </div>\
        </div>',
    data: ()=> {
        return {
            mapTypeId: ['Standard', 'Silver', 'Retro', 'Dark', 'Night', 'Aubergine'],
            googleMap: googleMap,
            curLatLng: googleMapConfig.center,
        };
    },
    mounted: (data)=> {
        for (var i in googleMapStyle.ids) {
            googleMap.mapTypes.set(googleMapStyle.ids[i],
                new google.maps.StyledMapType(
                    googleMapStyle[googleMapStyle.ids[i]], {name: googleMapStyle.ids[i]}));
            googleMap.setMapTypeId(googleMapStyle.ids[i]);
        }
        googleMap.setMapTypeId('Standard');
        var updateCurLatLng = ()=> {
            googleMapConfig.center.lat = googleMap.center.lat();
            googleMapConfig.center.lng = googleMap.center.lng();
        };


        googleMap.addListener('drag', updateCurLatLng);

    },
    methods: {
        changeLat: (curLatLng)=> {
            curLatLng.lat = Number(curLatLng.lat);
            if(isNaN(curLatLng.lat) || curLatLng.lat > 90 || curLatLng.lat < -90) curLatLng.lat = googleMap.center.lat();
            else {
                googleMap.setCenter(curLatLng);
            }
        },
        changeLng: (curLatLng)=> {
            curLatLng.lng = Number(curLatLng.lng);
            if(isNaN(curLatLng.lng) || curLatLng.lng > 180 || curLatLng.lng < -180) curLatLng.lng = googleMap.center.lng();
            else {

                googleMap.setCenter(curLatLng);
            }
        },
        changeMapType: (type)=> {
            googleMap.mapTypes.set(type, new google.maps.StyledMapType(googleMapStyle[type]));
            googleMap.setMapTypeId(type);
        }
    }
});



new Vue({
    el: '#input-group'
});
