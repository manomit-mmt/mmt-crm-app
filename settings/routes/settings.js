'use strict';

const MasterGroup = require('../db/mongo/schemas').masterGroupSchema;
const ObjectType = require('../db/mongo/schemas').objectTypeSchema;
const FieldType = require('../db/mongo/schemas').fieldTypeSchema;
const PropertySettingsSchema = require('../db/mongo/schemas').propertySettingsSchema; 
const { requiredAuth } = require('../middlewares/auth');
const router = require('express').Router();


router.get('/group/parent', requiredAuth, async (req, res) => {
    const parentGroups = await MasterGroup.find({parentId: {$ne: null}, moduleName: req.params.moduleName});
    res.status(200).send({data: parentGroups});
});

router.get('/group/list/', requiredAuth, async (req, res) => {
    const query = {};
    query.companyId = req.userInfo.data.companyId;
    query.status = true;
    if(req.query['objectType']) {
        query.moduleName = req.query['objectType'];
    }
    const result = await MasterGroup.find(query);
    const data = [];
    for(const val of result) {
        const propertyCount = await PropertySettingsSchema.find({ groupId: val._id }).count()
        data.push({
            _id: val._id,
            name: val.name,
            relationalName: val.relationalName,
            parentId: val.parentId,
            moduleName: val.moduleName,
            status: val.status,
            createdBy: val.createdBy,
            companyId: val.companyId,
            createdAt: val.createdAt,
            noOfProperty: propertyCount
        });
    }
    res.status(200).send({data: result});
});

router.get('/group/get-group-by-id/:groupId', requiredAuth, async (req, res) => {
    const result = await MasterGroup.find({_id: req.params.groupId, status: true});
    const propertyCount = await PropertySettingsSchema.find({ groupId: result[0]._id }).count() 
    res.status(200).send({data: result, noOfProperty: propertyCount});
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
        const groupExists = await MasterGroup.find({name, companyId: req.userInfo.data.companyId, status: true});
        if(groupExists.length > 0) {
            res.status(500).send({message: 'Group already exists'});
        } else {
            const groupData = await MasterGroup.create({
                name,
                relationalName,
                parentId,
                moduleName: req.body.objectType,
                createdBy: req.userInfo.data._id,
                companyId: req.userInfo.data.companyId
            });
            res.status(200).send({message: 'Added successfully', data: groupData});
            
        }
        

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
        const data = await MasterGroup.find({_id: req.body.groupId});
        res.status(200).send({message: 'Updated successfully', data});

    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

router.post('/group/delete', requiredAuth, async (req, res) => {
    try {
        await MasterGroup.updateOne({
            _id: req.body.groupId
        }, {
            $set: {
                status: false
            }
        });
        res.status(200).send({message: 'Deleted successfully', data: null});
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
