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
                text: json.text,
                CreatedAt: json['created_at'].split('+')[0],
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
        });
    }

    // get Brief info of id and Coordinates
    getNewTweetsDownToId(pastId, max = 20) {
        return this.elasticSearch.searchAfterId(pastId, 'tweet', 'twitter', max).then((res)=>{
            return res.hits.hits.map((data)=>{
                return data['_source'].tweet;
            });
        }, (err)=> {
            console.error(err);
        });
    }

    // get Tweet Detail info
    getTweetDetail(id) {

    }

    getCount() {
    }

    hasNew(id) {
        return true;
    }
}

const tweetsQueue = new TweetsQueue();

module.exports = tweetsQueue;