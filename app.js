const mongoose = require('mongoose'); //third party --for connecting
const express = require('express'); //third party
const fileupload = require("express-fileupload");
const bodyParser = require ('body-parser'); //core module
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const path = require("path");
const colors = require("colors");
const errorHandler = require("./middleware/customizederror");


const db = require('./database/db');
const users_route = require('./routes/user_route');




const app = express();

app.use(express.json());

app.use(cookieParser());



//File upload
app.use(fileupload());

// api log
app.use(morgan('dev'))


app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(users_route);





// const PORT = process.env.PORT || 4000;

app.listen(80);