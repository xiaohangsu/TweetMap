var koa = require('koa');
var request = require('request');
var OAuth   = require('oauth-1.0a');
var crypto  = require('crypto');

var app = koa();

var oauth = OAuth({
    consumer: {
        oauth_consumer_key: 'yIzrJlgbCpDzlMSmoBd6jKZfo',
        oauth_nonce: 'Y89G3sFShAcr3FpzwVzDpKgvkxJ7pYZfzSv2jUP5tzTmhvOYdD',
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: '1318622958',
        oauth_token: '760285412455624704-nTz2BQJlvCIA98pI5dkU6DCx7MuquTC',
        oauth_version: '1.0'
    },
    signature_method: 'HMAC-SHA1',
    hash_function: function(base_string, key) {
        return crypto.createHmac('sha1', key).update(base_string).digest('base64');
    }
});

var request_data = {
    url: 'https://stream.twitter.com/1.1/statuses/filter.json?track=twitter',
    method: 'POST',
    data: {
        status: 'Hello Ladies + Gentlemen, a signed OAuth request!'
    }
};

request({
    url: request_data.url,
    method: request_data.method,
    form: oauth.authorize(request_data)
}, function(error, response, body) {
    console.log(body);
});


app.use(function *(){
  this.body = 'Hello World';
});

app.listen(3000);