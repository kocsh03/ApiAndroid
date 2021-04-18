const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user_model");
const crypto = require("crypto");
const path = require("path");
//-------------------------Photo Upload-----------------------------

exports.UserPhotoUpload = asyncHandler(async (req, res, next) => {
    console.log('user photo upload', req.params.id)
    const user = await User.findById(req.params.id);
  
    console.log(user);
    if (!user) {
      return next(new ErrorResponse(`No user found with ${req.params.id}`), 404);
    }
  
  
    if (!req.files) {
      return next(new ErrorResponse(`Please upload a file`, 400));
    }
  
    const file = req.files.file;
  
    // Make sure the image is a photo and accept any extension of an image
    // if (!file.mimetype.startsWith("image")) {
    //   return next(new ErrorResponse(`Please upload an image`, 400));
    // }
  
    // Check file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
          400
        )
      );
    }
  
    file.name = `photo_${user.id}${path.parse(file.name).ext}`;
  
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
      if (err) {
        console.err(err);
        return next(new ErrorResponse(`Problem with file upload`, 500));
      }
  
      //insert the filename into database
      await User.findByIdAndUpdate(req.params.id, {
        photo: file.name,
      });
    });
  
    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
  
  // Get token from model , create cookie and send response
  const sendTokenResponse = (user, statusCode, res) => {
  
    const token = user.getSignedJwtToken();
  
    const options = {
      //Cookie will expire in 30 days
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
  
    // Cookie security is false .if you want https then use this code. do not use in development time
    if (process.env.NODE_ENV === "proc") {
      options.secure = true;
    }
  
    //we have created a cookie with a token
    res
      .status(statusCode)
      .cookie("token", token, options) // key , value ,options
      .json({
        success: true,
        token,
        data: user
      });
  
  };
  
  ////////-----Update----///////////////////////////////////////////
  exports.updateUser = asyncHandler(async (req, res, next) => {
    const id = req.params.id
    // const user = await User.findById(req.params.id);
    const { fname, lname, email, username} = req.body;
  
    // if (!user) {
    //   return next(new ErrorResponse("User not found"), 404);
    // }
  
    User.findByIdAndUpdate(req.params.id, { fname, lname, email, username },{new:false},
      function (err, docs) {
        if (err) {
          res.status(200).json({
            success: false,
            error:err.message,
          });
        }
        else {
          res.status(200).json({
            success: true,
            data: docs,
          });
        }
      }
    )
  
    //   let newuser = await user.updateOne({_id : id}, {firstName:firstName,lastName:lastName,email:email,address:address,phone:phone})
    // ;
    //   res.status(200).json({
    //     success: true,
    //     data: newuser,
    //   });
  
  })
  