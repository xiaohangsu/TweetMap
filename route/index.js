const Router       = require('koa-router');
const send         = require('koa-send');
const GOOGLEMAPAPI = require('../config').GoogleMapAPI;

const router = new Router();

router.get('/', function*() {
    yield this.render('./index', {
        googleMapAPI: GOOGLEMAPAPI
    });
});

router.get('/dist/bundle.js', function*(){
    yield send(this, './dist/bundle.js');
});

router.get('/dist/main.min.css', function*(){
    yield send(this, './dist/main.min.css');
});


module.exports = router;