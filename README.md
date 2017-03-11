# TweetMap
Real-time streaming Tweets showing on Google Map. | Experimental

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
> tweetOauth
> > key: user key
> > 
> > secret: user secret
> > 
> > token
> > > key: app key
> > > 
> > > secret: app secret
> > 
> > elasticSearchURL: (localhost or host)


## Depolyment
* AWS EC2 for Elasticsearch
* AWS Elasticbeanstalk for web application

##Feature
* live-stream tweets
* search for keywords
* search for a select point within given distance
* change map layout

### Dev Feature
* live reload Front-End Changes using webpack-dev-server
* live reload Back-End Changes using [nodemon](https://github.com/remy/nodemon)