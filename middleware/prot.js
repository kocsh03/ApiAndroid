//PROTECT THE MIDDLEWARE
const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user_model");

//Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  console.log("Here")
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer") 
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];
    console.log(token)
  }else{
    console.log("No token")
  }

  //Make sure token exist
  if (!token) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }

  try {
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
});
