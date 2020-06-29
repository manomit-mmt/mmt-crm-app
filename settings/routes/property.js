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
                companyId: req.userInfo.data.companyId
            };

            const data = await MasterField.create(config);
            res.status(200).send({message: 'Property added successfully', data: data});
        }

    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

module.exports = router;