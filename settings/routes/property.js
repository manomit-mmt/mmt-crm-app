'use strict';

const { requiredAuth } = require('../middlewares/auth');
const PropertyValidator = require('../validations').PropertyValidator;
const MasterField = require('../db/mongo/schemas').masterFieldSchema;

const router = require('express').Router();

router.put('/create', requiredAuth, async (req, res) => {
    try {
        const validateData = {
            fieldLabel: req.body.fieldLabel,
            fieldType: req.body.fieldType,
            groupId: req.body.groupId
        };
        await PropertyValidator.createPropertyValidation(validateData);
        
        const internalName = req.body.fieldLabel.toString().toLowerCase().split(" ").join("_");

        const propertyExists = await MasterField.find({internalName, createdBy: req.userInfo.data._id});
        if(propertyExists.length > 0) {
            const propertyExistsInModule = propertyExists[0].moduleId.includes(req.body.moduleId);
            if(propertyExistsInModule) {
                res.status(500).send({message: 'Property label already exists'});
            } else {
                const { inModuleId, moduleId } = propertyExistsInModule[0];
                inModuleId.push(req.body.moduleId);
                moduleId.push(req.body.moduleId);
    
                const newInModuleIds = new Set(moduleId);
                const newModuleIds = new Set(moduleId);

                await MasterField.updateOne({
                    _id: propertyExistsInModule[0]._id,

                }, {
                    $set: {
                        moduleId: newModuleIds,
                        inModuleId: newInModuleIds
                    }
                });
                res.status(200).send({message: 'Updated successfully', data: null});
            }
        } else {
            const config = {
                fieldLabel: req.body.fieldLabel,
                fieldType: req.body.fieldType,
                groupId: req.body.groupId,
                internalName,
                inModuleId: [req.body.moduleId],
                moduleId: [req.body.moduleId],
                createdBy: req.userInfo.data._id
            };

            const data = await MasterField.create(config);
            res.status(200).send({message: 'Property added successfully', data: data});
        }

    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

module.exports = router;