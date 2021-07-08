const mongoclient = require('mongodb');
const express = require('express');
const path = require('path');
const fs = require('fs');
const port = 3000;

// set the name of the website
var config = fs.readFileSync("./package.json", "utf8", (err,jsonstring)=>{
});

config = JSON.parse(config);

const website_name = config.name;

// Initializing the app
const app = express();

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'));

// PUG SPECIFIC STUFF
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'));

// ENDPOINTS
app.get('/', (req,res)=>{
    res.status(200).render('index.pug', {title:website_name});
});

app.get('/', (req,res)=>{
    res.status(200).render('register.pug', {title:website_name});
})

app.listen(port,()=>{
    console.log("The server is running at port : ", port);
});