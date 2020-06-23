'use strict';

const { requiredAuth } = require('../middlewares/auth');
const router = require('express').Router();

const EmailFeedDB = require('../db/mongo/schemas').emailFeedSchema;

router.get('/get-email-feed-by-contact/:contactId', requiredAuth, async(req, res) => {
    try {
        const data = await EmailFeedDB.find({contactId: req.params.contactId});
        res.status(200).send({data});
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

module.exports = router;