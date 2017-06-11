const Koa   = require('koa');
const views = require('koa-views');

const app   = new Koa();
app.use(views(__dirname,{
    map: {
        html: 'ejs'
    }
}));


const index  = require('./route/index');
const tweet  = require('./route/tweet');

app
    .use(index.routes())
    .use(tweet.routes())
    .use(tweet.allowedMethods())
    .use(index.allowedMethods());

app.listen(8081);