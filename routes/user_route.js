const express = require('express');
const User = require('../models/user_model');
const router = express.Router();

const {  UserPhotoUpload, updateUser } = require("../middleware/update");

const { protect } = require("../middleware/auth");

const{check, validationResult} = require('express-validator'); //validation for users data
const bcryptjs = require('bcryptjs') //for password encryption
const jwt = require("jsonwebtoken");


//-------------------------REGISTRATION----------------------------------
router.post('/user/register',[
    check('fname', 'fname should not be empty').not().isEmpty(),
    check('lname', 'lname should not be empty').not().isEmpty(),
    check('gender', 'gender should not be empty').not().isEmpty(),
    check('email', 'email should not be empty').not().isEmpty(),
    check('username', 'username should not be empty').not().isEmpty(),
    check('password', 'password should not be empty').not().isEmpty()
    
],function(req,res){
    const validationErr = validationResult(req);


    if(validationErr.isEmpty())
    {
        //valid
        const fname = req.body.fname;
        const lname = req.body.lname;
        const gender = req.body.gender;
        const email = req.body.email;
       
        const username = req.body.username;
        const password = req.body.password;
        bcryptjs.hash(password, 10, function(hash_err, hash_pw){
           
           const data = new User({fname:fname, lname:lname, gender:gender, email:email, username:username, password:hash_pw })
            data.save().then(function(result){
                res.status(201).json({success : true, message:"User registration successful!!"})
            })
            .catch(function(err1){
                res.status(500).json({message : err1.message})
            })
        })
      
    
    
    }

    else{
        //invalid
        res.status(400).json({
            errors : validationErr.array()
        })
    }

    
})

//------------------------------------LOGIN------------------------------------------------------------
router.post('/user/login', function(req, res){
  const username =  req.body.username;  //from form
  const password = req.body.password; //from form

//check if username is valid or not
  User.findOne({username : username})
  .then(function(userData){
      if(userData==null){
          //user not found
         return res.status(403).json({message: "Invalid username or password"})
      }
      //user found

    
      bcryptjs.compare(password, userData.password, function(err, result1){
          if(result1===false){
            return res.status(403).json({message: "Invalid username or password"})
          }
          //username and password valid
          //token generate

         const token =  jwt.sign({userId: userData._id},'secretkey')
         const id =  jwt.sign({userId: userData._id},'id')
          res.status(200).json({
              success : true,
              token : token, 
              id: userData._id,
              message:"Login successful"
            })

      })

  })
  .catch(function(e){
      res.status(500).json({error : e});
  })
})

//---------------------FETCHING USER DETAILS-----------------------------------------------

router.get("/me/:id", (req, res) => {
    const id = req.params.id;
    console.log(id);
    User.findById({ _id: id })
      .then((data) => {
        res.status(200).json({
          success: true,
          _id: id,
          data,
        });
      })
      .catch(function (e) {
        res.status(500).json({ error: e });
      });
  });



//-----------------------------------------------------------
router.put("/user/:id/photo" ,UserPhotoUpload)

router.put("/user/update/:id", updateUser)


module.exports = router;