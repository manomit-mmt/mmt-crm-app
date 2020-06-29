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
    const parentGroups = await MasterGroup.find({parentId: {$ne: null}, moduleName: req.params.moduleName});
    res.status(200).send({data: parentGroups});
});

router.get('/group/list', requiredAuth, async (req, res) => {
    const result = await MasterGroup.find({moduleName: req.params.moduleName});
    res.status(200).send({data: result});
});

router.get('/group/search', requiredAuth, async (req, res) => {
    const regex = new RegExp(req.query["term"], 'i');
    const result = await MasterGroup.find({name: regex, moduleId: req.query['moduleId'], inModuleId: { $nin: [req.query['moduleId']] }}).limit(20);
    res.status(200).send({data:result});
});

router.post('/group/create', requiredAuth, async (req, res) => {
    try {
        const { name, parentId, isFound } = req.body;
        let relationalName = '';
        if (parentId === null || parentId === undefined || parentId === '') {
            relationalName = name;
        } else {
            const parentGroupDetails = await MasterGroup.find({parentId});
            relationalName = `${parentGroupDetails[0].name}-${name}`;
        }

        const groupData = await MasterGroup.create({
            name,
            relationalName,
            parentId,
            moduleName: req.body.moduleName,
            createdBy: req.userInfo.data._id,
            companyId: req.userInfo.data.companyId
        });
        res.status(200).send({message: 'Added successfully', data: groupData});
        

    } catch(err) {
        res.status(422).send({message: err.message});
    }
});

router.post('/group/edit', requiredAuth, async (req, res) => {
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
