'use strict';

const { Jwt } = require('../utility');

module.exports.requiredAuth = (req, res, next) => {
    console.log("Inside middleware function");
    try {
        Jwt
        .verifyToken(req.header('Authorization').replace('Bearer', '').trim())
        .then((userData) => {
            req.userInfo = userData;
            next();
        })
        .catch(() => {
            res.status(401).send({message: 'Unauthorized access'});
        });
    } catch(err) {
        res.status(404).send({message: 'Unauthorized access'});
    }
    
};