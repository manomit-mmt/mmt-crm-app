'use strict';

const amqp = require('amqplib/callback_api');


const CONN_URL = process.env.RABBIT_MQ_CONN;
let ch = null;

amqp.connect(CONN_URL, (err, conn) => {
    if(err) console.log(err)
    conn.createChannel((err, channel) => {
        ch = channel;
    })
});

module.exports.publishToQueue = async (queueName, data) => {
    ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data)));
};

module.exports.receiveFromQueue = (callback) => {
    ch.consume('user-to-settings', msg => {
        const data = JSON.parse(msg.content.toString());
        return callback(data);
    }, {noAck:true});
    
};

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});