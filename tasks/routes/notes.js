'use strict';

const { requiredAuth } = require('../middlewares/auth');
const router = require('express').Router();

const NoteDB = require('../db/mongo/schemas').noteSchema;

router.get('/get-notes-by-contact-id/:contactId', requiredAuth, async(req, res) => {
    try {
      const data = await NoteDB.find({contactId: req.params.contactId});
      res.status(200).send({data});
    } catch(err) {
      res.status(500).send({message: err.message});
    }
});

module.exports = router;