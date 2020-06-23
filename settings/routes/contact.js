'use strict';

const { requiredAuth } = require('../middlewares/auth');
const ContactDB = require('../db/mongo/schemas').contactSchema;

const router = require('express').Router();

router.post('/create', requiredAuth, async (req, res) => {
    try {
        const { data } = req.body;
        const response = await ContactDB.create({
            data,
            companyId: req.userInfo.data.companyId,
            userId: req.userInfo.data._id
        });
        res.status(200).send({response, message: 'Contact created successfully'});
    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

router.post('/edit', requiredAuth, async (req, res) => {
    try {
        const { contactId, data } = req.body;
        const response = await ContactDB.updateOne({
            _id: contactId
        }, {
            $set: {
                data
            }
        });
        res.status(200).send({response, message: 'Contact updated successfully'});
    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

router.post('/delete', requiredAuth, async (req, res) => {
    try {
        const { contactId } = req.body;
        const response = await ContactDB.updateOne({
            _id: contactId
        }, {
            $set: {
                status: false
            }
        });
        res.status(200).send({response, message: 'Contact deleted successfully'});
    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

router.get('/list', requiredAuth, async (req, res) => {
    try {
        const contactData = await ContactDB.find({status: true, userId: req.userInfo.data._id, companyId: req.userInfo.data.companyId});
        const responsData = [];
        for(const cData of contactData) {
            let config = {};
            if(cData.data !== undefined) {
                for(let [key,value] of Object.entries(cData.data)) {
                    config[key] = value;
                }
                config['contactId'] = cData._id;
                responsData.push(config);
            }
            
        }
        res.status(200).send({data:responsData});
    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

router.get('/:contactId', async (req, res) => {
    try {
        const contactData = await ContactDB.findById(req.params.contactId);
        const responsData = [];
        let config = {};
        if(contactData.data !== undefined) {
            for(let [key,value] of Object.entries(contactData.data)) {
                config[key] = value;
            }
            config['contactId'] = contactData._id;
            responsData.push(config);
        }
        
        res.status(200).send({data:responsData});
    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

module.exports = router;