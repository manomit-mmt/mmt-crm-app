'use strict';

const { requiredAuth } = require('../middlewares/auth');
const PropertyValidator = require('../validations').PropertyValidator;
const PropertySetting = require('../db/mongo/schemas').propertySettingsSchema;

const { publishToQueue, receiveFromQueue } = require('../utility/mqService');

const router = require('express').Router();

router.post('/create', requiredAuth, async (req, res) => {
    try {
        const validateData = {
            fieldLabel: req.body.fieldLabel,
            fieldType: req.body.fieldType,
            groupId: req.body.groupId
        };
        await PropertyValidator.createPropertyValidation(validateData);
        
        const internalName = req.body.fieldLabel.toString().toLowerCase().split(" ").join("_");

        const propertyExists = await PropertySetting.find({internalName, createdBy: req.userInfo.data._id, objectType: req.body.objectType});
        if(propertyExists.length > 0) {
            res.status(500).send({message: 'Property label already exists'});
        } else {
            const config = {
                fieldLabel: req.body.fieldLabel,
                fieldType: req.body.fieldType,
                groupId: req.body.groupId,
                internalName,
                objectType: req.body.objectType,
                createdBy: req.userInfo.data._id,
                companyId: req.userInfo.data.companyId,
                description: req.body.description ? req.body.description : ''
            };

            const data = await PropertySetting.create(config);
            const responseData = await PropertySetting.find({_id: data._id}).populate('fieldType')
            .populate('groupId')
            .populate('objectType')
            .populate('createdBy');
            res.status(200).send({message: 'Property added successfully', data: responseData});
        }

    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

router.post('/edit', requiredAuth, async(req, res) => {
    try {
        const internalName = req.body.fieldLabel.toString().toLowerCase().split(" ").join("_");
        await PropertySetting.updateOne({
            _id: req.body.propertyId
        }, {
            $set: {
                fieldLabel: req.body.fieldLabel,
                fieldType: req.body.fieldType,
                groupId: req.body.groupId,
                internalName,
                objectType: req.body.objectType,
                createdBy: req.userInfo.data._id,
                companyId: req.userInfo.data.companyId,
                description: req.body.description ? req.body.description : ''
            }
        });
        const responseData = await PropertySetting.find({_id: req.body.propertyId}).populate('fieldType')
            .populate('groupId')
            .populate('objectType')
            .populate('createdBy');
        res.status(200).send({message: 'Updated successfully', data: responseData});
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

router.post('/delete', requiredAuth, async (req, res) => {
    try {
        await PropertySetting.updateOne({
            _id: req.body.propertyId
        }, {
            $set: {
                status: false
            }
        });
        res.status(200).send({message: 'Deleted successfully', data: null});
    } catch(err) {
        res.status(500).send({message: err.message});
    }
})

router.get('/list', requiredAuth, async(req, res) => {
    const data = await PropertySetting
    .find({companyId: req.userInfo.data.companyId, status: true})
    .populate('fieldType')
    .populate('groupId')
    .populate('objectType')
    .populate('createdBy');
    res.status(200).send({message: 'Listed successfully', data});
    // await publishToQueue('settings-to-user',{userId: req.userInfo.data._id});
    // receiveFromQueue(responseData => {
    //     res.status(200).send({message: 'Listed successfully', data, user: responseData.user});
    // })
    
});

router.get('/get-property-by-id/:propertyId', requiredAuth, async(req, res) => {
    const data = await PropertySetting
    .find({_id: req.params.propertyId, status: true})
    .populate('fieldType')
    .populate('groupId')
    .populate('objectType')
    .populate('createdBy');
    res.status(200).send({message: 'Listed successfully', data});
    // await publishToQueue('settings-to-user',{userId: req.userInfo.data._id});
    // receiveFromQueue(responseData => {
    //     res.status(200).send({message: 'Listed successfully', data, user: responseData.user});
    // })
});

router.post('/check-property-exists', requiredAuth, async (req, res) => {
    const internalName = req.body.fieldLabel.toString().toLowerCase().split(" ").join("_");
    const propertyExists = await PropertySetting.find({internalName, companyId: req.userInfo.data.companyId});
    if(propertyExists.length > 0) {
        res.status(500).send({message: 'Property label already exists'});
    } else {
        res.status(200).send({message: 'Property label not exists'});
    }
})

module.exports = router;