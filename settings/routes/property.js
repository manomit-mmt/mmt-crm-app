'use strict';

const { requiredAuth } = require('../middlewares/auth');
const PropertyValidator = require('../validations').PropertyValidator;
const MasterField = require('../db/mongo/schemas').masterFieldSchema;

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

        const propertyExists = await MasterField.find({internalName, createdBy: req.userInfo.data._id, moduleName: req.body.moduleName});
        if(propertyExists.length > 0) {
            res.status(500).send({message: 'Property label already exists'});
        } else {
            const config = {
                fieldLabel: req.body.fieldLabel,
                fieldType: req.body.fieldType,
                groupId: req.body.groupId,
                internalName,
                moduleName: req.body.moduleName,
                createdBy: req.userInfo.data._id,
                companyId: req.userInfo.data.companyId,
                description: req.body.description ? req.body.description : ''
            };

            const data = await MasterField.create(config);
            res.status(200).send({message: 'Property added successfully', data: data});
        }

    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

router.post('/edit', requiredAuth, async(req, res) => {
    try {
        const internalName = req.body.fieldLabel.toString().toLowerCase().split(" ").join("_");
        await MasterField.updateOne({
            _id: req.body.propertyId
        }, {
            $set: {
                fieldLabel: req.body.fieldLabel,
                fieldType: req.body.fieldType,
                groupId: req.body.groupId,
                internalName,
                moduleName: req.body.moduleName,
                createdBy: req.userInfo.data._id,
                companyId: req.userInfo.data.companyId,
                description: req.body.description ? req.body.description : ''
            }
        });
        res.status(200).send({message: 'Updated successfully', data: null});
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

router.get('/list', requiredAuth, async(req, res) => {
    const data = await MasterField.find({moduleName: req.query['moduleName'], companyId: req.userInfo.data.companyId});
    res.status(200).send({message: 'Listed successfully', data});
});

router.get('/get-property-by-id/:propertyId', requiredAuth, async(req, res) => {
    const data = await MasterField.find({_id: req.params.propertyId});
    res.status(200).send({message: 'Listed successfully', data});
});

module.exports = router;