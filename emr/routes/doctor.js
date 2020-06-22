'use strict';

const router = require('express').Router();

const {requiredAuth} = require('../middlewares/auth');
const { publishDoctorData,receiveDoctorData } = require('../utility/mqService');
const { extname } = require('path');
const DoctorDB = require('../db/mongo/schemas').doctorSchema,
      DepartmentDB = require('../db/mongo/schemas').departmentSchema;

const EMRValidator = require('../validations').EMRValidators

const aws = require('aws-sdk'),
      multer = require('multer'),
      multerS3 = require('multer-s3');
const { route } = require('./patient');


const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

const uploadProfileImage = multer({
    storage: multerS3({
        s3,
        bucket: process.env.BUCKET_NAME,
        metadata: function (req, file, cb) {
            cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
            const fileExtName = extname(file.originalname);
            cb(null, `doctor/${Date.now().toString()}${fileExtName}`)
        },
        acl: 'public-read',
        cacheControl: 'max-age=31536000'
    })
});

router.get('/department/list', requiredAuth, async (req, res) => {
    const data = await DepartmentDB.find({status: false});
    res.status(200).send({data});
});

router.post('/create', requiredAuth, uploadProfileImage.single('profileImage'), async (req, res) => {
    try {
        
        await EMRValidator.doctorValidation(req.body);
        const { email, password, firstName, lastName, mobileNumber } = req.body;
        const signupConfig = {
            email,
            password,
            firstName,
            lastName,
            mobileNumber,
            companyId: req.userInfo.data.companyId,
            action: 'INSERT'
        };
        await publishDoctorData('doctor-to-user',signupConfig); // now communicating between user service via doctor-to-user queue, publishDoctorData is in mqService.js
        receiveDoctorData(async responsData => {
            if(responsData.success === true) {
                const { gender, dob, designation, department, education } = req.body;
                const doctorData = await DoctorDB.create({
                    email,
                    firstName,
                    lastName,
                    mobileNumber,
                    gender,
                    dob,
                    designation,
                    department,
                    education,
                    profileImage: req.file === undefined ? (gender === 'MALE' ? 'doctor/male.png': 'doctor/female.png'): req.file.key,
                    loginId: responsData.loginId
                });
                res.status(200).send({data:doctorData, message: 'Doctor created successfully', s3Uri: process.env.S3_URI});
            } else {
                s3.deleteObject({
                    Bucket: process.env.BUCKET_NAME,
                    Key: req.file.key
                }, (err, data) => {
                    res.status(422).send({data: null, message: 'Doctor already exists'})
                })
            }
        });
    } catch(err) {
        res.status(500).send({message: err.message});
    }
     
});

router.put('/edit', requiredAuth, uploadProfileImage.single('profileImage'), async (req, res) => {
    try {
        await EMRValidator.doctorValidationEdit(req.body);
        const { firstName, lastName, loginId } = req.body;
        const userConfig = {
            firstName,
            lastName,
            loginId,
            action: 'UPDATE'
        };
        await publishDoctorData('doctor-to-user',userConfig);
        receiveDoctorData(async responsData => {
            const { gender, dob, designation, department, education } = req.body;
            const doctorDetails = await DoctorDB.findById(req.body.doctorId);
            const doctorData = await DoctorDB.updateOne({
                _id: req.body.doctorId
            }, {
                $set: {
                    firstName,
                    lastName,
                    gender,
                    dob,
                    designation,
                    department,
                    education,
                    profileImage: req.file === undefined ? doctorDetails.profileImage: req.file.key
                }
            });
            res.status(200).send({data:doctorData, message: 'Doctor updated successfully', s3Uri: process.env.S3_URI});
        });
    } catch(err) {
        res.status(500).send({message: err.message});
    }
});

router.get('/list', requiredAuth, async (req, res) => {
    const data = await DoctorDB.find({}).populate('department');
    res.status(200).send({data});
});

router.get('/get-doctor-by-id/:doctorId', requiredAuth, async (req, res) => {
    const data = await DoctorDB.find(req.params.doctorId).populate('department');
    res.status(200).send({data});
});


module.exports = router;