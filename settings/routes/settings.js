'use strict';

const MasterGroup = require('../db/mongo/schemas').masterGroupSchema;
const ObjectType = require('../db/mongo/schemas').objectTypeSchema;
const FieldType = require('../db/mongo/schemas').fieldTypeSchema; 
const { requiredAuth } = require('../middlewares/auth');
const router = require('express').Router();


router.get('/group/parent', requiredAuth, async (req, res) => {
    const parentGroups = await MasterGroup.find({parentId: {$ne: null}, moduleName: req.params.moduleName});
    res.status(200).send({data: parentGroups});
});

router.get('/group/list/', requiredAuth, async (req, res) => {
    const result = await MasterGroup.find({moduleName: req.query['moduleName'], companyId: req.userInfo.data.companyId});
    res.status(200).send({data: result});
});

router.get('/group/get-group-by-id/:groupId', requiredAuth, async (req, res) => {
    const result = await MasterGroup.find({_id: req.params.groupId});
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

router.get('/object-type/list', requiredAuth, async (req, res) => {
    const objectTypeList = await ObjectType.find({status: true});
    res.status(200).send({data: objectTypeList});
});
router.get('/field-type/list', requiredAuth, async (req, res) => {
    const fieldTypeList = await FieldType.find({status: true});
    res.status(200).send({data: fieldTypeList});
});
router.get('/get-field-type-by-id/:fieldTypeId', requiredAuth, async( req, res) => {
    const fieldTypeList = await FieldType.find({status: true, _id: req.params.fieldTypeId});
    res.status(200).send({data: fieldTypeList});
})


module.exports = router;
