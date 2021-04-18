const { rawListeners } = require("../models/productsModel");

const jwt = require('jsonwebtoken');
const { userInfo } = require("os");          




module.exports.verifyUser = function(req, res, next){
try{
    const token = req.headers.authorization.split(" ")[1];
    const data = jwt.verify(token, 'secretkey');
    userInfo.findOne({_id : data.customerId})
    .then(function(result){
       // req.user =(result)
        req.user = result; //information of the user
        next();

    })

.catch(function(e){
    res.status(401).json({error:e})
})
next();
}
catch(e){
res.status(401).json({error:e})
}
}


// Second guard 
module.exports.verifyAdmin =  function(req,res,next){
    if(!req.userInfo){
        return res.status(401).json({message: "Invalid User"})
    }else if(req.userInfo.userType!=="Admin"){
        return req.status(401).json({message: "Unauthorized! "})
    }
    next();

}
module.exports.verifyCustomer =  function(req,res,next){
    if(!req.userInfo){
        return res.status(401).json({message: "Invalid User"})
    }else if(req.userInfo.userType!=="Customer"){
        return req.status(401).json({message: "Unauthorized! "})
    }
    next();

}

module.exports.verifyCustomerAdmin =  function(req,res,next){
    if(!req.userInfo){
        return res.status(401).json({message: "Invalid User"})
    }else if(req.userInfo.userType!=="Customer"|| req.userInfo.userType!=="Admin"){
        return req.status(401).json({message: "Unauthorized! "})
    }
    next();

}