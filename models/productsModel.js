const mongoose = require('mongoose');

const products = mongoose.model("Products",{

    Guitar :{
        type:String
    },
    Gears : {
        type: String
    },
    AMP:{
        type:String
    },
    Strings:{
        type:String
    }
})

module.exports = products