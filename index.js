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

var con = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "",
    database : "tradeguide"
});

con.connect((err)=>{
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

app.post('/register_auth', (req,res,next)=>{

    console.log("hey there!!");

    // error starting from here.. incmplete
    console.log(req.body.name);

    inputdata ={
        name: req.body.name,
        uname: req.body.uname,
        email: req.body.email,
        pass: req.body.password,
        re_pass: req.body.re_password,
        country: req.body.country_form,
        state: req.body.state_form,
        address: req.body.address,
        category: req.body.category,
        ph_number: req.body.ph_number,
        website: req.body.website,
        description: req.body.description
    }

    if(inputdata.pass != inputdata.re_pass){
        // go back
    }

    con.sql = "SELECT * from trader WHERE email = req.body.email";
    con.query(sql, (err, result)=>{
        if(result.length <= 0){
            // error
        }
    })

    // check unique email address

    var flag = false;

    con.connect((err)=>{
        if(err){
            throw err;
        }
        con.query("SELECT * FROM trader", (err, result, fields)=>{
            if(err){
                throw err;
            }
            for(var i=0;i<result.length;i++){
                if(result[i].email == inputdata.email){
                    flag = true;
                    break;
                }
            }

            if(flag == true){
                // go back with error
            }
            else{
                for(var i=0;i<result.length;i++){
                    if(result[i].uname == inputdata.uname){
                        flag = true;
                        break;
                    }
                }

                if(flag == true){
                    // go back with error
                }
                else{
                    con.sql = "INSERT INTO trader(uname, name, email, password, address, state, country, category, ph_number, website, desciption) VALUES (" + inputdata.uname + "," + inputdata.name + "," + inputdata.email + "," + inputdata.password + "," + inputdata.address + "," + inputdata.state + "," + inputdata.country + "," + inputdata.category + "," + inputdata.ph_number + "," + inputdata.website + "," + inputdata.description;
                    con.query(sql, (err,result)=>{
                        console.log("The data entered");
                    });
                }
            }
        });
    });
});

app.listen(port,()=>{
    console.log("The server is running at port : ", port);
});