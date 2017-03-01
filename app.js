var koa   = require('koa');
const app = koa();


var index  = require('./route/index');
var tweet  = require('./route/tweet');
app
    .use(index.routes())
    .use(tweet.routes())
    .use(tweet.allowedMethods())
    .use(index.allowedMethods());
app.listen(3000);