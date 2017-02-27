var googleMapConfig = require('./google_map_config');
module.exports = new google.maps.Map(document.getElementById('map'), googleMapConfig.default);