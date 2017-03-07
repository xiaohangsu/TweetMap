const elasticsearch = require('elasticsearch');

class ElasticSearchLayer {
    constructor() {
        this.client = new elasticsearch.Client({
            host: 'localhost:9200'
        });
        this.id = 0;
    }

    addDocument(id, json, type, index) {
        return this.client.create({
            index: index,
            type : type,
            body: json,
            id: this.id++
        }).then((response)=>{
            console.log('Document added. id: ', id);
        }, (err)=>{
            console.log(err.message);
        });
    }

    addDocuments(jsons, type, index) {
        return this.client.bulk({
            index: index,
            type : type,
            body: json
        }).then((response)=>{
            console.log('Document added. id: ', id);
        }, (err)=>{
            console.log("error");
        });
    }

    getAfterId(id, type, index, size) {
        return this.client.search({
            index: index,
            type: type,
            size: size,
            body: {
                'from': 0,
                'query': {
                    'range': {
                        'tweet.id': {
                            'gt': id
                        }
                    }
                },
                'sort': [{'tweet.id': 'asc'}]
            }
        });
    }

    getKNewest(k, type, index) {
        return this.getCount(type, index).then((res)=> {
            let startId = res.count > k ? res.count - k : 0;
            return this.getAfterId(startId, type, index, k);
        });
    }

    getCount(type, index) {
        return this.client.count({
            index: index,
            type: type
        });
    }

    deleteIndex(index) {
        return this.client.indices.delete({
            index: index
        });
    }

    getId(id, type, index) {
        return this.client.get({
            index: index,
            type: type,
            id: id
        });
    }

    search(text, type, index) {
        return this.client.search({
            index: index,
            type: type,
            scroll: '60s',
            body: {
                size: 100,
                query: {
                    bool: {
                        should: [
                            {
                                match: {
                                    'tweetDetail.text': text
                                }
                            }
                        ]
                    }
                }
            }
        });
    }

    scroll(scrollId) {
        return this.client.scroll({
            scrollId: scrollId
        });
    }

    deleteIndexs() {
        return this.deleteIndex('*');
    }

}

module.exports = ElasticSearchLayer;

