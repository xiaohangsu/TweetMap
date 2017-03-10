var app    = require('koa')();
var router = require('koa-router')();
var send   = require('koa-send');

router.get('/', function*(){
    yield send(this, './index.html');
});


router.get('/dist/bundle.js', function*(){
    yield send(this, './dist/bundle.js');
});

router.get('/dist/main.min.css', function*(){
    yield send(this, './dist/main.min.css');
});


module.exports = router;