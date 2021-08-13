const mongoclient = require('mongodb');
const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const mysql = require('mysql');
const { COPYFILE_FICLONE } = require('constants');
const port = 3000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// set the name of the website
var config = fs.readFileSync("./package.json", "utf8", (err,jsonstring)=>{
});

config = JSON.parse(config);

const website_name = config.name;

// Initializing the app
const app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cookieParser());

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
        // console.log(result);
    });
});

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static'));

// PUG SPECIFIC STUFF
app.set('view engine', 'pug');
app.set('views', path.join(__dirname,'views'));

// to store the session
var session1;

// ENDPOINTS
app.get('/', (req,res)=>{
    res.status(200).render('index.pug', {title:website_name});
});

app.get('/register', (req,res)=>{
    res.status(200).render('register.pug', {title:website_name});
});

app.get('/register_user', (req,res)=>{
    res.status(200).render('register_user.pug', {title:website_name});
});

app.post("/register_user", (req,res)=>{

    inputdata = {
        fn: req.body.firstname,
        ln: req.body.lastname,
        email: req.body.email,
        password: req.body.re_password
    };

    var name = inputdata.fn + " " + inputdata.ln;

    var sql = "INSERT INTO person(name, email, ph_number, password) VALUES ('" + name + "', '" + inputdata.email + "', '' ,'" + inputdata.password + "')";

    console.log(sql);

    con.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            console.log(result);
        }
    });
});

app.get('/login', (req,res)=>{
    console.log(session1);
    if(session1 == null){
        // res.redirect("/trader_login");
        res.status(200).render('trader_login.pug', {title:website_name});
    }
    else{
        var sql = "SELECT * FROM trader WHERE (uname = " + "'" + session1.username + "')";
        console.log(sql);
        con.query(sql, (err,result)=>{
            if(err){
                throw err;
            }
            else{
                console.log(result);
                console.log("--------------");
                console.log(result[0]);
                // var x = result[0].stringify;
                res.status(200).render('trader_dashboard.pug', {title: website_name, data:result[0]});
            }
        });
        // res.status(200).render('trader_dashboard.pug', {title: website_name});
    }
});

app.post("/trader_login", (req,res)=>{

    inputdata = {
        uname : req.body.uname,
        password : req.body.password
    }

    var sql = "SELECT * from trader WHERE (uname = " + "'" + inputdata.uname + "'" + " AND password = " + "'" + inputdata.password + "'" + ")";

    console.log(sql);

    con.query(sql, (err, result)=>{
        if(err){
            throw err;
        }
        else{
            if(result == null || result.length <= 0){
                console.log("The session is NOT set");
            }
            else{
                console.log("The session is set");
                session1 = req.session;
                session1.username = inputdata.uname;
                session1.type = "trader";
                console.log(session1);
                res.redirect("/login");
            }
        }
    });
});

app.get("/user_login", (req,res)=>{
    console.log(session1);
    if(session1 == null){
        res.status(200).render("user_login.pug");
    }
    else{
        // something else later
    }
})

app.post("/user_login", (req,res)=>{

    inputdata = {
        uname : req.body.uname,
        password : req.body.password
    }

    console.log("uname : ", inputdata.uname);
    console.log("password : ", inputdata.password);

    var sql = "SELECT * from person WHERE (email = " + "'" + inputdata.uname + "'" + " AND password = " + "'" + inputdata.password + "'" + ")";

    console.log(sql);

    con.query(sql, (err,result)=>{
        if(err){
            throw err;
        }
        else{
            console.log(result);
            if((result == null) || (result.length <= 0)){
                req.session.destroy();
                session1 = null;
                res.redirect("/user_login");
            }
            else{
                session1 = req.session;
                session1.uname = inputdata.uname;
                session1.type = "user";
                res.redirect("/user_dashboard");
                // res.status(200).render("user_dashboard.pug");
            }
        }
    })
})

app.get("/user_dashboard", (req,res)=>{
    if((session1 == null) || (session1.type != "user")){
        res.redirect("/user_login");
    }
    else{
        res.status(200).render("user_dashboard.pug", {title: website_name, address: null, c_data: null});
    }
})

app.post("/user_dashboard", (req,res)=>{

    inputdata = {
        country : req.body.country,
        state : req.body.state,
        city : req.body.city,
        category : req.body.category,
        search : req.body.search
    }

    console.log("INPUTDATA");
    console.log(inputdata);

    if((session1 == null) || (session.type != "user")){
        res.redirect("/user_login");
    }
    else{

        var sql = "SELECT * from trader WHERE (country = " + "'" + inputdata.country + "'" + " AND state = " + "'" + inputdata.state + "'" + " AND city = " + "'" + inputdata.city + "'" + " AND category = " + "'" + inputdata.category + "'" + ")"; 
        con.query(sql, async(err,result)=>{
            if(err){
                throw err;
            }
            else{

                if(result == null || result.length <=0){
                    // something different
                }
                else{
                    // console.log("RESULT");
                    // console.log(result);
                    // something different

                    var addresses = [];
                    var temp = "";

                    for(var i=0;i<result.length;i++){
                        temp = temp + result[i].address + "," + result[i].city + "," + result[i].state + "," + result[i].pincode + "," + result[i].country;
                        addresses.push(temp);
                        temp = "";
                    }

                    var company_data = [];
                    // var temp2 = {};

                    for(var i=0;i<result.length;i++){
                        var temp2 = {};
                        temp2["name"] = result[i].name;
                        temp2["email"] = result[i].email;
                        temp2["phone"] = result[i].ph_number;
                        temp2["website"] = result[i].website;
                        temp2["description"] = result[i].description;
                        temp2["address"] = addresses[i];
                        company_data.push(temp2);
                    }

                    res.status(200).render('user_dashboard.pug', {title: website_name, address: addresses, c_data: company_data});
                }
            }
        })
    }
})

app.post("/edit_trader", (req,res)=>{
    if(session1 == null){
        res.redirect("/trader_login");
    }
    else{
        var inputdata = {
            name : req.body.name,
            email : req.body.email,
            country : req.body.country,
            state : req.body.state,
            city : req.body.city,
            pincode : req.body.pincode,
            address : req.body.address,
            category : req.body.category,
            ph_number : req.body.ph_number,
            website : req.body.website,
            description : req.body.description
        }

        var sql = "UPDATE trader SET email=" + "'" + inputdata.email + "', name=" + "'" + inputdata.name + "', country=" + "'" + inputdata.country + "', state=" + "'" + inputdata.state + "', city=" + "'" + inputdata.city + "', pincode=" + "'" + inputdata.pincode + "', address=" + "'" + inputdata.address + "',  category=" + "'" + inputdata.category + "', ph_number=" + "'" + inputdata.ph_number + "', website=" + "'" + inputdata.website  + "', description=" + "'" + inputdata.description + "' where uname=" + "'" + session1.username + "'";
        console.log(sql);

        con.query(sql, (err,result)=>{
            if(err){
                throw err;
            }
            else{
                console.log(result);
                res.redirect("/login");
            }
        });
        console.log(sql);
    }
});

app.get('/logout', (req,res)=>{
    req.session.destroy();
    session1 = null;
    res.redirect("/");
});

app.post("/display_locations", (req,res)=>{

    inputdata = {
        country : req.body.country,
        state : req.body.state,
        city : req.body.city,
        category : req.body.category,
        search : req.body.search
    }

    console.log("INPUTDATA");
    console.log(inputdata);
    // console.log(req.body.country);
    // console.log(req.body.state);
    // console.log(req.body.city);
    // console.log(req.body.category);
    // console.log(req.body.search);

    var sql = "SELECT * from trader WHERE (country = " + "'" + inputdata.country + "'" + " AND state = " + "'" + inputdata.state + "'" + " AND city = " + "'" + inputdata.city + "'" + " AND category = " + "'" + inputdata.category + "'" + ")"; 
    con.query(sql, async(err,result)=>{
        if(err){
            throw err;
        }
        else{

            if(result == null){
                // something different
            }
            else{
                console.log("RESULT");
                console.log(result);
                // something different

                var addresses = [];
                var temp = "";

                for(var i=0;i<result.length;i++){
                    temp = temp + result[i].address + "," + result[i].city + "," + result[i].state + "," + result[i].pincode + "," + result[i].country;
                    addresses.push(temp);
                    temp = "";
                }

                var company_data = [];
                // var temp2 = {};

                for(var i=0;i<result.length;i++){
                    var temp2 = {};
                    temp2["name"] = result[i].name;
                    temp2["email"] = result[i].email;
                    temp2["phone"] = result[i].ph_number;
                    temp2["website"] = result[i].website;
                    temp2["description"] = result[i].description;
                    temp2["address"] = addresses[i];
                    company_data.push(temp2);
                }

                /*
                console.log("Company_Data : ");
                console.log(company_data);
                console.log("-----------------------");
                */

                // console.log("Addresses before : ");
                // console.log(addresses);
                res.status(200).render('display_locations.pug', {title: website_name, address: addresses, c_data: company_data});
            }

            // res.status(200).render('display_locations.pug', {title: website_name, query: inputdata});
            /*
            console.log("Result : ");
            console.log(result);
            console.log("/////////////");
            */
        }
    })

    // console.log(sql);

    // res.status(200).render('display_locations.pug', {title: website_name, query: inputdata});

    // return res.redirect("");
});

app.get("/register_auth", (req,res)=>{
    res.status(200).render('register.pug', {title:website_name});
})

app.post('/register_auth', async(req,res)=>{

    console.log("hey there!!");

    // error starting from here. incomplete
    console.log(req.body.name);

    inputdata ={
        name: req.body.name,
        uname: req.body.uname,
        email: req.body.email,
        pass: req.body.password,
        re_pass: req.body.re_password,
        country: req.body.country,
        pincode: req.body.pincode,
        state: req.body.state,
        city: req.body.city,
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
                    var sql = "INSERT INTO trader(uname, name, email, password, address, city, state, pincode, country, category, ph_number, website, description) VALUES (" + "'" + inputdata.uname + "'" + "," + "'" + inputdata.name + "'" + "," + "'" + inputdata.email + "'" + "," + "'" + inputdata.pass + "'" + "," + "'" + inputdata.address + "'" + "," + "'" + inputdata.city + "'" + "," + "'" + inputdata.state + "'" + "," + "'" + inputdata.pincode + "'" + "," + "'" + inputdata.country + "'" + "," + "'" + inputdata.category + "'" + "," + "'" + inputdata.ph_number + "'" + "," + "'" + inputdata.website + "'" + "," + "'" + inputdata.description + "'" + ")";
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