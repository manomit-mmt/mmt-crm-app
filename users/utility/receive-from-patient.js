'use strict';

const CONN_URL = process.env.RABBIT_MQ_CONN;
const amqp = require('amqplib/callback_api');
const User = require('../db/mongo/schemas').userSchema,
      Role = require('../db/mongo/schemas').roleSchema;
const { Jwt, Password } = require('../utility');

const getPatientDetails = () => {
    amqp.connect(CONN_URL, (err, conn) => {
        conn.createChannel((err, ch) => {
            ch.consume('patient-message', msg => {
                console.log("......");
                console.log(JSON.parse(msg.content.toString()));
    
            }, {noAck:true});
            
            ch.consume('doctor-to-user', async msg => {
                // Received doctor signup informtion from emr service via doctor-to-user queue
                const responseData = {}
                const doctorData = JSON.parse(msg.content.toString());
                if(doctorData.action === 'INSERT') {
                    try {
                        const roleDetails = await Role.findOne({code: 'DOCTOR'});
                        const userData = await User.create({
                            email: doctorData.email,
                            password: doctorData.password,
                            name: `${doctorData.firstName} ${doctorData.lastName}`,
                            companyId: doctorData.companyId,
                            roleId: roleDetails._id,
                            mobileNumber: doctorData.mobileNumber
                        });
                        responseData.loginId = userData._id;
                        responseData.success = true;
                        responseData.name = userData.name;
                        responseData.email = userData.email;
                        responseData.mobileNumber = userData.mobileNumber;
    
                    } catch(err) {
                        responseData.loginId = null;
                        responseData.success = false;
                    }
                } else {
                    await User.updateOne({
                        _id: doctorData.loginId
                    }, {
                        $set: {
                            name: `${doctorData.firstName} ${doctorData.lastName}`
                        }
                    });
                    responseData.loginId = doctorData.loginId;
                    responseData.success = true;
                }

                ch.sendToQueue('user-to-doctor', Buffer.from(JSON.stringify(responseData))) // pass response data via user-to-doctor queue
            }, {noAck:true});

            ch.consume('settings-to-user', async msg => {
                const responseData = {};
                const userData = JSON.parse(msg.content.toString());
                const user = await User.find({_id: userData.userId}).populate('companyId').populate('roleId');
                responseData.user = user;
                ch.sendToQueue('user-to-settings', Buffer.from(JSON.stringify(responseData)));
            }, {noAck:true})
        })
    })
};



const receiveFromPatient = () => {
    getPatientDetails();
};

module.exports = receiveFromPatient;