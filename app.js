'use strict';
const express = require('express');
const app  = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('uploads'));

const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const autRoute = require('./routes/authRoute');

app.use('/user', userRoute);
app.use('/post', postRoute);
app.use('/auth', autRoute);


app.listen(port);