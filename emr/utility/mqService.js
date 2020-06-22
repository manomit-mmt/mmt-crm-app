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

module.exports.publishDoctorData = async (queueName, data) => {
    ch.sendToQueue(queueName, Buffer.from(JSON.stringify(data))) // send doctor signup information to user service via doctor-to-user queue
};

module.exports.receiveDoctorData = (callback) => {
    ch.consume('user-to-doctor', msg => {
        const data = JSON.parse(msg.content.toString());
        return callback(data);
    }, {noAck:true});
    
}

process.on('exit', (code) => {
    ch.close();
    console.log(`Closing rabbitmq channel`);
});