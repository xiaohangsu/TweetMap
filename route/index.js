const router       = require('koa-router')();
const send         = require('koa-send');
const GOOGLEMAPAPI = require('../config').GoogleMapAPI;
const CONFIG 	   = require('process').argv[2];

let STATIC_PATH = '';
if (CONFIG === 'dev') {
	STATIC_PATH = 'http://localhost:8080/';
} else if (CONFIG === 'dist') {
	STATIC_PATH = '/dist/';
}

router.get('/', (ctx, next)=> {
	console.log('/ GET |');
    return ctx.render('./index', {
        googleMapAPI: GOOGLEMAPAPI,
        staticPath  : STATIC_PATH 
    });
});

router.get('/dist/bundle.js', function*(){
    yield send(this, './dist/bundle.js');
});

router.get('/dist/main.min.css', function*(){
    yield send(this, './dist/main.min.css');
});


module.exports = router;