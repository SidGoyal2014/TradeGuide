const mongoclient = require('mongodb');
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const mysql = require('mysql');
const { COPYFILE_FICLONE } = require('constants');
const port = 3000;

// set the name of the website
var config = fs.readFileSync("./package.json", "utf8", (err,jsonstring)=>{
});

config = JSON.parse(config);

const website_name = config.name;

// Initializing the app
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : false}));

var con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "tradeguide"
});

con.connect(async(err)=>{
    if(err){
        throw err;
    }
    console.log("MySQL connected");
    con.query("SELECT * FROM trader", (err, result, fields)=>{
        console.log(result);
    });
});

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'));

// PUG SPECIFIC STUFF
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'));

// ENDPOINTS
app.get('/', (req,res)=>{
    res.status(200).render('index.pug', {title:website_name});
});

app.get('/register', (req,res)=>{
    res.status(200).render('register.pug', {title:website_name});
})

app.get("/register_auth", (req,res)=>{
    res.status(200).render('register.pug', {title:website_name});
})

app.post('/register_auth', async(req,res)=>{

    console.log("hey there!!");

    // error starting from here.. incmplete
    console.log(req.body.name);

    inputdata ={
        name: req.body.name,
        uname: req.body.uname,
        email: req.body.email,
        pass: req.body.password,
        re_pass: req.body.re_password,
        country: req.body.country,
        state: req.body.state,
        address: req.body.address,
        category: req.body.category,
        ph_number: req.body.ph_number,
        website: req.body.website,
        description: req.body.description
    }

    if(inputdata.pass != inputdata.re_pass){
        // go back
    }

    // check unique email address
    var sql = "SELECT * from trader WHERE email = " + inputdata.email;
    con.query(sql, async(err, result)=>{
        console.log(result);
        if(result == null || result.length <= 0){
            console.log("It's unique");

            // check unique username
            sql = "SELECT * FROM trader WHERE uname = " + inputdata.uname;
            con.query(sql, async(err, result)=>{
                if(result == null || result.length <= 0){
                    var sql = "INSERT INTO trader(uname, name, email, password, address, state, country, category, ph_number, website, description) VALUES (" + "'" + inputdata.uname + "'" + "," + "'" + inputdata.name + "'" + "," + "'" + inputdata.email + "'" + "," + "'" + inputdata.pass + "'" + "," + "'" + inputdata.address + "'" + "," + "'" + inputdata.state + "'" + "," + "'" + inputdata.country + "'" + "," + "'" + inputdata.category + "'" + "," + "'" + inputdata.ph_number + "'" + "," + "'" + inputdata.website + "'" + "," + "'" + inputdata.description + "'" + ")";
                    console.log(sql);
                    con.query(sql, async(err,result)=>{
                        if(err){
                            throw err;
                        }
                        else{
                            console.log("The data entered");
                            return res.redirect('/');
                        }
                    });
                }
                else{
                    // go back
                }
            });
        }
        else{
            // go back
        }
    });
});

app.listen(port,()=>{
    console.log("The server is running at port : ", port);
});