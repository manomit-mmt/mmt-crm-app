'use strict';

const TreatmentTypeDB = require('../db/mongo/schemas').treatmentTypeSchema,
      PatientDB = require('../db/mongo/schemas').patientSchema;

const EMRValidators = require('../validations').EMRValidators;
const { requiredAuth } = require('../middlewares/auth');

const { publishToQueue } = require('../utility/mqService');

const router = require('express').Router();


router.get('/all-treatment-type', requiredAuth, async (req, res) => {
  try {
    const data = await TreatmentTypeDB.find({status: true});
    res.status(200).send({data});
  } catch(err) {
    res.status(500).send({message: err.message});
  }
})

router.post('/create', requiredAuth, async (req, res) => {
  const config = {
    name: req.body.name,
    mobileNumber: req.body.mobileNumber,
    dob: req.body.dob,
    address: req.body.address,
    gender: req.body.gender,
    treatmentType: req.body.treatmentType,
    bloodGroup: req.body.bloodGroup,
  };

  try {
    await EMRValidators.patientValidation(config);
    const data = await PatientDB.create({
      ...config,
      companyId: req.userInfo.data.companyId,
      userId: req.userInfo.data._id
    });
    res.status(200).send({data, message: 'Patient added successfully'});
  } catch(err) {
    res.status(422).send({message: err.message});
  }
});

router.get('/list', requiredAuth, async (req, res) => {
  try {
    const data = await PatientDB.find({status: true});
    res.status(200).send({data});
  } catch (err) {
    res.status(500).send({message: err.message});
  }
});

router.put('/edit', requiredAuth, async (req, res) => {
  try {
    const config = {
      name: req.body.name,
      mobileNumber: req.body.mobileNumber,
      dob: req.body.dob,
      address: req.body.address,
      gender: req.body.gender,
      treatmentType: req.body.treatmentType,
      bloodGroup: req.body.bloodGroup,
    };
    await EMRValidators.patientValidation(config);
    const data = await PatientDB.updateOne({
      _id: req.body.patientId,
      companyId: req.userInfo.data.companyId,
      userId: req.userInfo.data._id
    }, {
      $set: {
        ...config
      }
    });
    res.status(200).send({data, message: 'Patient updated successfully'});
  } catch (err) {
    res.status(422).send({message: err.message});
  }
});

router.put('/delete', requiredAuth, async (req, res) => {
  try {
    const data = await PatientDB.updateOne({
      _id: req.body.patientId,
      companyId: req.userInfo.data.companyId,
      userId: req.userInfo.data._id
    }, {
      $set: {
        status: false
      }
    });
    res.status(200).send({data, message: 'Patient deleted successfully'}); 
  } catch(err) {
    res.status(500).send({message: err.message});
  }
});

router.get('/get-patient-by-id/:patientId', requiredAuth, async (req, res) => {
  try {
    const data = await PatientDB.findOne({status: true, _id: req.params.patientId});
    res.status(200).send({data, message: 'Patient listed successfully'});
  } catch(err) {
    res.status(500).send({message: err.message});
  }
});

router.get('/test-rabbit-mq', requiredAuth, async(req, res) => {
  await publishToQueue('patient-message',{name: 'john doe',age:20});
  res.status(200).send('Response from request');
});

module.exports = router;
