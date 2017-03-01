var app    = require('koa')();
var router = require('koa-router')();
var send   = require('koa-send');

router.get('/', function*(){
    yield send(this, './index.html');
});

module.exports = router;