'use strict';

const { requiredAuth } = require('../middlewares/auth');
const router = require('express').Router();

const EmailFeedDB = require('../db/mongo/schemas').emailFeedSchema,
      TaskDB = require('../db/mongo/schemas').taskSchema,
      NoteDB = require('../db/mongo/schemas').noteSchema;


router.get('/get-activity-feed-by-contact-id/:contactId', requiredAuth, async(req, res) => {
    try {
        const notes = await NoteDB.find({contactId: req.params.contactId});
        const emailFeeds = await EmailFeedDB.find({contactId: req.params.contactId});
        const tasks = await TaskDB.find({contactId: req.params.contactId});
        const data = {
            notes,
            emailFeeds,
            tasks
        }
        res.status(200).send({data});
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});


module.exports = router