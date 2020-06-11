'use strict';

const ModuleMaster = require('../db/mongo/schemas').moduleSchema,
      MasterGroup = require('../db/mongo/schemas').masterGroupSchema,  
      ModuleMasterValidator = require('../validations').ModuleMasterValidator;  
const { requiredAuth } = require('../middlewares/auth');
const router = require('express').Router();

router.post('/module/create', async (req, res) => {
   try {
        await ModuleMasterValidator.moduleMasterValidation(req.body);
        const { name, moduleType } = req.body;
        const moduleData = await ModuleMaster.create({
            name,
            slug: name.split(" ").join("-").toLowerCase(),
            moduleType
        });
        res.status(200).send({data:moduleData});
        
   } catch(err) {
        res.status(422).send({message: err.message});
   } 
});

router.get('/group/parent', requiredAuth, async (req, res) => {
    const parentGroups = await MasterGroup.find({parentId: {$ne: null}, moduleId: req.query['moduleId'], inModuleId: req.query['moduleId']});
    res.status(200).send({data: parentGroups});
});

router.get('/group/list', requiredAuth, async (req, res) => {
    const result = await MasterGroup.find({moduleId: req.query['moduleId'], inModuleId: req.query['moduleId']});
    res.status(200).send({data: result});
});

router.get('/group/search', requiredAuth, async (req, res) => {
    const regex = new RegExp(req.query["term"], 'i');
    const result = await MasterGroup.find({name: regex, moduleId: req.query['moduleId'], inModuleId: { $nin: [req.query['moduleId']] }}).limit(20);
    res.status(200).send({data:result});
});

router.put('/group/create', requiredAuth, async (req, res) => {
    try {
        const { name, parentId, isFound } = req.body;
        let relationalName = '';
        if (parentId === null || parentId === undefined || parentId === '') {
            relationalName = name;
        } else {
            const parentGroupDetails = await MasterGroup.find({parentId});
            relationalName = `${parentGroupDetails[0].name}-${name}`;
        }
        
        if(isFound) {
            const groupNameExists = await MasterGroup.find({name});
            if (groupNameExists.length > 0) {
                const { inModuleId, moduleId } = groupNameExists[0];
                inModuleId.push(req.body.moduleId);
                moduleId.push(req.body.moduleId);
    
                const newInModuleIds = new Set(moduleId);
                const newModuleIds = new Set(moduleId);

                await MasterGroup.updateOne({
                    _id: groupNameExists[0]._id,

                }, {
                    $set: {
                        parentId,
                        moduleId: newModuleIds,
                        inModuleId: newInModuleIds
                    }
                });
                res.status(200).send({message: 'Updated successfully', data: null});
            }
        } else {
            const groupData = await MasterGroup.create({
                name,
                relationalName,
                parentId,
                inModuleId: [req.body.moduleId],
                moduleId: [req.body.moduleId],
                createdBy: req.userInfo.data._id
            });
            res.status(200).send({message: 'Added successfully', data: groupData});
        }
        

    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

router.post('/group/edit', async (req, res) => {
    try {

        await MasterGroup.updateOne({
            _id: req.body.groupId
        }, {
            $set: {
                name: req.body.name,
                parentId: req.body.parentId === null || req.body.parentId === undefined || req.body.parentId === '' ? null: req.body.parentId
            }
        });
        res.status(200).send({message: 'Updated successfully', data: null});

    } catch(err) {
        res.status(500).send({message: err.message});
    }
});


module.exports = router;
