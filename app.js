const koa   = require('koa');
const send = require('koa-send');
const app   = koa();

const index  = require('./route/index');
const tweet  = require('./route/tweet');

app
    .use(index.routes())
    .use(tweet.routes())
    .use(tweet.allowedMethods())
    .use(index.allowedMethods());


app.listen(80);