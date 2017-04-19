const tweetsQueue  = require('../data/tweetsQueue');
let Kafka           = require('kafka-node');

class KafkaStream {
    constructor() {
        this.createConsumerGroup();
    }

    createConsumerGroup() {
        this.consumerGroup = new Kafka.ConsumerGroup(
            {
                host: '34.208.177.202:2181/',
                groupId: 'TwitterStreamGroup',
                sessionTimeout: 15000,
                fromOffset: 'latest'
            }, ['twitterstream']
        );
        this.consumerGroup.on('message', (message)=> {
            tweetsQueue.addTweet(JSON.parse(message.value));
        });

        this.consumerGroup.on('error', (err)=> {
            console.log('KafkaStream - Error', err);
        });
        this.consumerGroup.on('offsetOutOfRange', (err)=> {
            console.log('KafkaStream - Message', err);
        });
    }
}

const kafkaStream = new KafkaStream();

module.exports = kafkaStream;