const mongoose = require('mongoose');
const User = mongoose.model('User',{
    fname : {
        type: String,
        required: true
    }, 
    lname : {
        type: String,
        required: true
    },
    gender : {
        type: String,
        required: true
    },

    email: {
        type: String,
        required : true,
        unique: true
    },


    username : {
        type: String,
        required:true,
        unique:true
    },

    password : {
        type: String,
        required: true
    },

    photo: {
        type: String,
        default: "no-photo.jpg",
      },

    UserType:{
    type: String,
    enum: ['Admin', 'User' ],
    default: 'User' //less previlage 
    }
})

module.exports = User;