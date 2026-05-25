const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Rakhi@123",
    database: "VowSecure"
});

db.connect((err) => {

    if(err){
        console.log("Database Connection Failed");
        console.log(err);
    } else {
        console.log("MySQL Connected");
    }

});

app.get("/", (req, res) => {
    res.send("VowSecure Backend Running");
});


// GET ALL LABS

app.get("/labs", (req, res) => {

    db.query("SELECT * FROM labs", (err, result) => {

        if(err){
            console.log(err);
            res.send(err);
        } else {
            res.send(result);
        }

    });

});


// GET LABS BY CITY

app.get("/labs/:city", (req, res) => {

    const city = req.params.city;

    db.query(
        "SELECT * FROM labs WHERE city = ?",
        [city],
        (err, result) => {

            if(err){
                console.log(err);
                res.send(err);
            } else {
                res.send(result);
            }

        }
    );

});
 
// GET LABS BY TEST TYPE
app.get("/tests/:test", (req, res) => {

    const test = req.params.test;

    db.query(
        "SELECT * FROM labs WHERE tests_available LIKE ?",
        [`%${test}%`],
        (err, result) => {

            if(err){
                console.log(err);
                res.send(err);
            } else {
                res.send(result);
            }

        }
    );

});

// USER SIGNUP

app.get("/signup", (req, res) => {

    const name = req.query.name;
    const email = req.query.email;
    const password = req.query.password;
    const city = req.query.city;

    db.query(
        "INSERT INTO users (name, email, password, city) VALUES (?, ?, ?, ?)",
        [name, email, password, city],
        (err, result) => {

            if(err){
                console.log(err);
                res.send(err);
            } else {
                res.send("User Registered Successfully");
            }

        }
    );

});
 // USER LOGIN
app.get("/login", (req, res) => {

    const email = req.query.email;
    const password = req.query.password;

    db.query(
        "SELECT * FROM users WHERE email = ? AND password = ?",
        [email, password],
        (err, result) => {

            if(err){
                console.log(err);
                res.send(err);
            } else {

                if(result.length > 0){
                    res.send("Login Successful");
                } else {
                    res.send("Invalid Email or Password");
                }

            }

        }
    );

});

app.get("/recommend", (req, res) => {

    const family_history = req.query.family_history;
    const cousin_marriage = req.query.cousin_marriage;
    const sexually_active = req.query.sexually_active;

    let recommendations = [];

    // Genetic Risk

    if(family_history === "yes"){
        recommendations.push("HPLC");
        recommendations.push("Extended Carrier Screening");
    }

    // Relative Marriage Risk

    if(cousin_marriage === "yes"){
        recommendations.push("Genetic Counseling");
        recommendations.push("Thalassemia Screening");
    }

    // Infectious Disease Screening

    if(sexually_active === "yes"){
        recommendations.push("HIV Test");
        recommendations.push("Hepatitis B");
        recommendations.push("VDRL");
    }

    // Default Health Tests

    recommendations.push("CBC");
    recommendations.push("Blood Group & Rh Typing");

    res.json(recommendations);

});

app.listen(8000, () => {
    console.log("Server running on port 8000");
});