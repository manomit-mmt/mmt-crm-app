'use strict';

const TaskValidators = require('../validations').TaskValidators;
const TaskDB = require('../db/mongo/schemas').taskSchema;
const TaskTypesDB = require('../db/mongo/schemas').taskTypeSchema;

const { requiredAuth } = require('../middlewares/auth');
const router = require('express').Router();

router.post('/create', requiredAuth, async(req, res) => {
    try {
      const config = {
        title: req.body.title,
        description: req.body.description,
        dueDate: req.body.dueDate,
        dueTime: req.body.dueTime,
        taskTypeId: req.body.taskTypeId,
        companyId: req.userInfo.data.companyId,
        userId: req.userInfo.data._id
      }
      await TaskValidators.taskValidation(config);
      const data = await TaskDB.create(config);
      res.status(200).send({data});
    } catch(err) {
      res.status(422).send({message: err.message});
    }
});

router.post('/edit', requiredAuth, async(req, res) => {
  try {
    const taskExists = await TaskDB.find({
      _id: { $ne: req.body.taskId },
      title: req.body.title,
      userId: req.userInfo.data._id
    });
    if(taskExists.length > 0) {
      res.status(422).send({message: 'Task already exists'});
    } else {
      await TaskDB.updateOne({
        _id: req.body.taskId
      }, {
        $set: {
          title: req.body.title,
          description: req.body.description,
          dueDate: req.body.dueDate,
          dueTime: req.body.dueTime,
          taskTypeId: req.body.taskTypeId,
        }
      });
      res.status(200).send({message: 'Task updated successfully'});
    }
  } catch(err) {
    res.status(500).send({message: err.message});
  }
});

router.post('/delete', requiredAuth, async (req, res) => {
    try {
      await TaskDB.updateOne({
        _id: req.body.taskId
      }, {
        $set: {
          status: false
        }
      });
      res.status(200).send({message: 'Task deleted successfully'});
    } catch(err) {
      res.status(500).send({message: err.message});
    }
});

router.get('/all-task', requiredAuth, async (req, res) => {
    try {
      const data = await TaskDB.find({status: true});
      res.status(200).send({data});
    } catch(err) {
      res.status(500).send({message: err.message});
    }
});

router.get('/task/:taskId', requiredAuth, async(req, res) => {
    try {
      const data = await TaskDB.findById(req.params.taskId);
      res.status(200).send({data});
    } catch(err) {
      res.status(500).send({message: err.message});
    }
});

router.get('/task-types', requiredAuth, async(req, res) => {
  try {
    const data = await TaskTypesDB.find({});
    res.status(200).send({data});
  } catch(err) {
    res.status(500).send({message: err.message});
  }
});

module.exports = router;
