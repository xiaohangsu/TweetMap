const ELASTICSEARCH_URL  = require('./../config').elasticSearchURL;
const elasticSearch     = new (require('elasticsearch').Client)({
    host: ELASTICSEARCH_URL
});

class TweetsQueue {
    constructor() {
        this.count = -1;
        this.elasticSearch = elasticSearch;
        this.elasticSearch.indices.delete({
            index:'twitter'
        }).then((res)=> {
            this.elasticSearch.indices.create({
                index: 'twitter'
            }).then((res)=> {
                return this.elasticSearch.indices.putMapping({
                    type:'tweet',
                    index:'twitter',
                    body: {
                        'tweet': {
                            'properties': {
                                'tweet.coordinates': {
                                    'type': 'geo_point'
                                }
                            }
                        }
                    }
                });
            }).then((res)=> {
                console.log('Create Elasticsearch Mapping: ', res);
            }, (err)=> {
                console.log('Create Elasticsearch Mapping Error: ', err);
            });
        }, (err)=> {
            console.log('delete indices Error', err);
        });
    }

    tweet(json) {
        return {
            tweet: {
                id: this.count,
                coordinates: json.coordinates.coordinates
            },
            tweetDetail: {
                id: json['id_str'],
                text: json.text,
                createdAt: json['timestamp_ms'],
                user: {
                    name: json.user['screen_name'],
                    profileImageUrl: json.user['profile_image_url_https']
                }
            }
        };
    }

    addTweet(json) {
        this.elasticSearch.create({
            index: 'twitter',
            type : 'tweet',
            body: this.tweet(json),
            id: this.count++
        }).then((response)=>{
            console.log('Document added. id: ', this.count);
        }, (err)=>{
            console.log(err.message);
        });
    }

    // get Brief of id and Coordinates
    getTopk(k) {
        let startId = this.count > k ? this.count - k : 0;
        return this.getNewTweetsDownToId(startId, k);
    }

    // get Brief info of id and Coordinates
    getNewTweetsDownToId(pastId, max = 200) {
        return this.elasticSearch.search({
            type: 'tweet',
            index: 'twitter', 
            size: max,
            body: {
                'from': 0,
                'query': {
                    'range': {
                        'tweet.id': {
                            'gt': pastId
                        }
                    }
                },
                'sort': [{'tweet.id': 'asc'}]
            }
        }).then((res)=>{
            return res.hits.hits.map((data)=>{
                return data['_source'].tweet;
            });
        }, (err)=> {
            console.error(err);
            return err;
        });
    }

    // get Tweet Detail info
    getTweetDetail(id) {
        return this.elasticSearch.get({
            type:'tweet', 
            index: 'twitter',
            id: id
        }).then((res)=> {
            return res['_source'].tweetDetail;
        }, (err)=> {
            console.log(err);
            return err;
        });
    }

    search(text) {
        return this.elasticSearch.search({
            type: 'tweet',
            index: 'twitter',
            scroll: '60s',
            body: {
                size: 100,
                query: {
                    bool: {
                        should: [{
                            match: {
                                'tweetDetail.text': text
                            }
                        }]
                    }
                }
            }
        }).then((res)=> {
            let response = {
                data: res.hits.hits.map((data)=>{
                    return data['_source'].tweet;
                }),
                total: res.hits.total
            };
            if (response.data.length < response.total) {
                response.scrollId = res._scroll_id;
            }
            return response;
        }, (err)=> {
            console.log(err);
            return err;
        });
    }

    scroll(scrollId) {
        return this.elasticSearch.scroll({
            scrollId: scrollId,
            scroll: '120s'
        }).then((res)=> {
            let response = {
                data: res.hits.hits.map((data)=>{
                    return data['_source'].tweet;
                }),
                total: res.hits.total
            };
            if (response.data.length < response.total) {
                response.scrollId = res._scroll_id;
            }
            return response;
        }, (err)=> {
            console.log(err);
            return err;
        });
    }

    getCount() {
        return this.count;
    }

    searchGeo(dis, coord) {
        return this.elasticSearch.search({
            index: 'twitter',
            type: 'tweet',
            scroll: '60s',
            body: {
                size: 100,
                'query': {
                    'bool' : {
                        'must' : {
                            'match_all' : {}
                        },
                        'filter' : {
                            'geo_distance' : {
                                'distance' : dis + 'km',
                                'tweet.coordinates' : coord
                            }
                        }
                    }
                }
            }
        }).then((res)=> {
            let response = {
                data: res.hits.hits.map((data)=>{
                    return data['_source'].tweet;
                }),
                total: res.hits.total
            };
            if (response.data.length < response.total) {
                response.scrollId = res._scroll_id;
            }
            return response;
        }, (err)=> {
            console.log(err);
        });
    }

    hasNew(id) {
        console.log(id, this.count);
        return this.count - 1 != parseInt(id);
    }
}

const tweetsQueue = new TweetsQueue();

module.exports = tweetsQueue;