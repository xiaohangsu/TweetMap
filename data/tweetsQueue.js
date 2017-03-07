const tweetsQueueConfig = require('./../config').tweetsQueue;
const elasticSearch     = new (require('./elasticSearchLayer'))();

class TweetsQueue {
    constructor() {
        this.elasticSearch = elasticSearch;
        this.elasticSearch.deleteIndexs();
        this.count = 0;
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
                createdAt: json['created_at'].split('+')[0],
                user: {
                    name: json.user['screen_name'],
                    profileImageUrl: json.user['profile_image_url_https']
                }
            }
        };
    }

    addTweet(json) {
        this.elasticSearch.addDocument(this.count, this.tweet(json), 'tweet', 'twitter');
        this.count++;
    }

    // get Brief of id and Coordinates
    getTopk(k) {
        return this.elasticSearch.getKNewest(k, 'tweet', 'twitter').then((res)=>{
            return res.hits.hits.map((data)=>{
                return data['_source'].tweet;
            });
        }, (err)=> {
            console.error(err);
            return err;
        });
    }

    // get Brief info of id and Coordinates
    getNewTweetsDownToId(pastId, max = 200) {
        return this.elasticSearch.getAfterId(pastId, 'tweet', 'twitter', max).then((res)=>{
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
        return this.elasticSearch.getId(id, 'tweet', 'twitter').then((res)=> {
            return res['_source'].tweetDetail;
        }, (err)=> {
            console.log(err);
            return err;
        });
    }

    search(text) {
        return this.elasticSearch.search(text, 'tweet', 'twitter').then((res)=> {
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

    scroll(text, scrollId) {
        return this.elasticSearch.scroll(scrollId).then((res)=> {
            console.log(res);
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

    hasNew(id) {
        return this.count != parseInt(id);
    }
}

const tweetsQueue = new TweetsQueue();

module.exports = tweetsQueue;