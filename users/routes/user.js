'use strict';

const AuthValidators = require('../validations').AuthValidators;
const User = require('../db/mongo/schemas').userSchema,
      Company = require('../db/mongo/schemas').comanySchema,
      Role = require('../db/mongo/schemas').roleSchema;
const { Jwt, Password } = require('../utility');
const { requiredAuth } = require('../middlewares/auth');
const router = require('express').Router();

router.post('/signup', async (req, res) => {
  try {
    const email = req.body.email;
    const regex = new RegExp(["^", email, "$"].join(""), "i");
    await AuthValidators.signupValidation(req.body);

    const emailOrPhoneExists = await User.find({
      $or: [ {email: regex}, {mobileNumber: req.body.mobileNumber} ]
    });
    if(emailOrPhoneExists.length > 0) {
      res.status(409).send({message: "Email or mobile number alreday exists"});
    } else {
      const companyExists = await Company.find({name: req.body.companyName});
      if(companyExists.length > 0) {
        res.status(409).send({message: "Compnay already registered"});
      } else {
        const companyDetails = await Company.create({
          name: req.body.companyName
        });
        const roleDetails = await Role.findOne({code: 'ADMIN'});

        const userData = await User.create({
          email: req.body.email,
          password: req.body.password,
          name: req.body.name,
          companyId: companyDetails._id,
          roleId: roleDetails._id,
          mobileNumber: req.body.mobileNumber
        });
        const token = await Jwt.getToken({
          _id: userData._id, 
          email: userData.email, 
          mobileNumber: userData.mobileNumber, 
          companyId: companyDetails._id, 
          roleId: roleDetails._id
        });
        res.status(200).send({token});

      }
    }

  } catch(err) {
    res.status(422).send({message: err.message});
  }
});

router.post('/login', (req, res) => {
  return new Promise((resolve, reject) => {
    AuthValidators
    .loginValidation(req.body)
    .then(async () => {
      const email = req.body.email;
      const regex = new RegExp(["^", email, "$"].join(""), "i");
      return await User.find({email: regex}).populate('roleId').populate('companyId');
    })
    .then(userData => 
      userData.length > 0
        ? Promise.resolve(userData)
        : Promise.reject({
            message: 'Email or password not found'
          })  
    )
    .then(async userData => {
      const isPasswordMatched = await Password.compare(userData[0].password, req.body.password);
      if(isPasswordMatched) {
        const token = await Jwt.getToken({
          _id: userData[0]._id, 
          email: userData[0].email, 
          mobileNumber: userData[0].mobileNumber, 
          companyId: userData[0].companyId._id, 
          roleId: userData[0].roleId._id
        });
        res.status(200).send({token});
      } else {
        res.status(404).send({message: 'Email or password not found'});
      }
    })
    .catch(err => {
      res.status(404).send({message: err.message});
    })
  });
});

router.get('/current-user', requiredAuth, async (req, res) => {
  const userDetails = await User.find({_id: req.userInfo.data._id}).populate('companyId').populate('roleId');
  res.status(200).send({data: userDetails});
});

router.get('/test-load-balancer', (req, res) => {
  res.send("Hello World");
})

module.exports = router;
