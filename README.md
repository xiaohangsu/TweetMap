# TweetMap
Real-time streaming Tweets showing on Google Map.
<p align="center">
  <img src='https://xiaohangsu.files.wordpress.com/2017/03/screen-shot-2017-03-12-at-6-52-01-pm.png?w=1476'/>
</p>


## Setup

### App
```
npm install --save
node app.js
```

### Development
```
npm install --save-dev
npm run-script build &
npm run-script run
```


## Main
* [**Google Map Api**](https://developers.google.com/maps/documentation/javascript/)
* [**Twitter Stream Api**](https://dev.twitter.com/streaming/overview)
* [**Elasticsearch**](https://www.elastic.co/)

## Develop
* [**Vue**](https://vuejs.org/) The Progressive
JavaScript Framework
* [**Koajs**](http://koajs.com/) next generation web framework for node.js
* [**elasticsearch.js**](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html)
* [**webpack2**](https://webpack.js.org/)
* [**Bootstrap**](http://getbootstrap.com/)

## Config
```
tweetOauth
	key: user key
	secret: user secret
	token
		key: app key
		secret: app secret
		
elasticSearchURL: (elasticSearchURL or host)

GoogleMapAPI: your google Map API
```

## Depolyment
* AWS EC2 for Elasticsearch
* AWS Elasticbeanstalk for web application

##Feature
### App Feature
* live-stream tweets

<p align="center">
  <img src='https://xiaohangsu.files.wordpress.com/2017/03/screen-shot-2017-03-12-at-6-55-01-pm.png'/>
</p>

* search for keywords
* search for a select point within given distance
* change map layout Standard Silver Retro Dark Night Aubergine
<p align="center">
  <img src='https://xiaohangsu.files.wordpress.com/2017/03/screen-shot-2017-03-12-at-7-02-14-pm.png'/>
</p>



### Dev Feature
* live reload Front-End Changes using webpack-dev-server
* live reload Back-End Changes using [nodemon](https://github.com/remy/nodemon)

## License
MIT License
