const { faker } = require('@faker-js/faker');
const mysql = require('mysql2');
const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"/views"));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended: true}));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta_app',
  password: 'weCvL1xY9971#',
});


let randomUser =  () => {
    return [
        faker.string.uuid(),
        faker.internet.username(),
        faker.internet.email(),
        faker.internet.password(),
    ];
}

//Home route
app.get("/",(req,res)=>{    
    let q = `select count(*) from user`;
    try{
    connection.query(q, (err,result) => {
        if(err) throw err;
        let count = result[0]["count(*)"];
        res.render("home.ejs", {count});
    });
    }catch (err){
        console.log(err);
        res.send("Some error in DB");
    }
});


//Show route
app.get("/users",(req,res)=>{    
    let q = `select * from user`;
    try{
    connection.query(q, (err,users) => {
        if(err) throw err;
        res.render("showUsers.ejs", {users});
    });
    }catch (err){
        res.send("Some error in DB");
    }
});

//Edit route
app.get("/users/:id/edit", (req,res)=>{    
    let {id} = req.params;
    let q = `select *from user where id = '${id}'`;
    
    try{
    connection.query(q, (err,result) => {
        if(err) throw err;
        let user = result[0];
        res.render("edit.ejs", {user});
    });
    }catch (err){
        res.send("Some error in DB");
    }
});

app.patch("/user/:id", (req,res)=>{    
    let {id} = req.params;
    let {password: formPass, username: NewUsername} = req.body;

    let q = `select *from user where id = '${id}'`;
    
    try{
    connection.query(q, (err,result) => {
        if(err) throw err;
        let user = result[0];
        if(formPass!=user.password){
            res.send("Wrong Password");
        } else{
            let q2 = `UPDATE user SET username='${NewUsername}' WHERE id='${id}'`;
                connection.query(q2, (err,result) => {
                if(err) throw err;
                res.redirect("/users");
            });
        }
    });
    }catch (err){
        res.send("Some error in DB");
    }
});

//add user
app.get("/users/add", (req,res)=>{    
        res.render("addUser.ejs");
});

app.post("/users", (req,res)=>{    
    let {id, username, email, password} = req.body;
    let q = `INSERT INTO user (id,username,email,password) VALUES (?,?,?,?)`;
    let val = [id,username, email, password];

    try{
    connection.query(q,val, (err,result) => {
        if(err) throw err;
        res.redirect("/users");
    });
    }catch (err){
        res.send("Some error in DB");
    }
});

//delete user
app.get("/users/:id/delete", (req,res)=>{    
    let {id} = req.params;
    let q = `select *from user where id = '${id}'`;
    
    try{
    connection.query(q, (err,result) => {
        if(err) throw err;
        let user = result[0];
        res.render("delete.ejs", {user});
    });
    }catch (err){
        res.send("Some error in DB");
    }
});

app.delete("/user/:id", (req,res)=>{    
    let {id} = req.params;
    let {password: formPass} = req.body;

    let q = `select *from user where id = '${id}'`;
    
    try{
    connection.query(q, (err,result) => {
        if(err) throw err;
        let user = result[0];
        if(formPass!=user.password){
            res.send("Wrong Password");
        } else{
            let q2 = `DELETE FROM user WHERE id='${id}'`;
                connection.query(q2, (err,result) => {
                if(err) throw err;
                res.redirect("/users");
            });
        }
    });
    }catch (err){
        res.send("Some error in DB");
    }
});





app.listen("8080", () =>{
    console.log("Server is listning to port 8080");
});




