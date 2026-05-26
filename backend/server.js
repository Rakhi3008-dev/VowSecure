
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rakhi@123",
  database: "VowSecure",
});

db.connect((err) => {
  if (err) {
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
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(result);
    }
  });
});

// GET LABS BY CITY

app.get("/search-healthcare/:city", async (req, res) => {
  const city = req.params.city;

  try {
    const fetch = (await import("node-fetch")).default;

    const query = `
[out:json];
(
node["healthcare"="laboratory"](area[name="${city}"]);
node["amenity"="hospital"](area[name="${city}"]);
);
out;
`;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        body: query,
      }
    );

    const text = await response.text();

    console.log(text);

    const data = JSON.parse(text);

    const places = data.elements.map((place) => ({
      name: place.tags.name || "Healthcare Center",

      lat: place.lat,

      lon: place.lon,

      address: place.tags["addr:full"] || city,
    }));

    res.json(places);
  } catch (error) {
    console.log(error);

    res.send("Error");
  }
});

// GET LABS BY TEST TYPE
app.get("/tests/:test", (req, res) => {
  const test = req.params.test;

  db.query(
    "SELECT * FROM labs WHERE tests_available LIKE ?",
    [`%${test}%`],
    (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(result);
      }
    }
  );
});

// USER SIGNUP

app.get("/signup", async (req, res) => {
  const name = req.query.name;
  const email = req.query.email;
  const password = req.query.password;
  const city = req.query.city;

  try {
    // HASH PASSWORD

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, city) VALUES (?, ?, ?, ?)",

      [name, email, hashedPassword, city],

      (err, result) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          res.send("User Registered Successfully");
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.send("Error");
  }
});
// USER LOGIN
app.get("/login", (req, res) => {
  const email = req.query.email;
  const password = req.query.password;

  db.query(
    "SELECT * FROM users WHERE email = ?",

    [email],

    async (err, result) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        if (result.length > 0) {
          const user = result[0];

          // CHECK HASHED PASSWORD

          const isMatch = await bcrypt.compare(password, user.password);

          if (isMatch) {
            res.send("Login Successful");
          } else {
            res.send("Invalid Email or Password");
          }
        } else {
          res.send("Invalid Email or Password");
        }
      }
    }
  );
});
//recommendations based on user input
app.get("/recommend", (req, res) => {
  const family_history = req.query.family_history;

  const cousin_marriage = req.query.cousin_marriage;

  const sexually_active = req.query.sexually_active;

  let recommendations = [];

  let riskScore = 0;

  // GENETIC RISK

  if (family_history === "yes") {
    recommendations.push("HPLC");

    recommendations.push("Extended Carrier Screening");

    riskScore += 40;
  }

  // COUSIN MARRIAGE

  if (cousin_marriage === "yes") {
    recommendations.push("Genetic Counseling");

    recommendations.push("Thalassemia Screening");

    riskScore += 30;
  }

  // SEXUAL HEALTH

  if (sexually_active === "yes") {
    recommendations.push("HIV Test");

    recommendations.push("Hepatitis B");

    recommendations.push("VDRL");

    riskScore += 20;
  }

  // DEFAULT TESTS

  if (recommendations.length === 0) {
    recommendations.push("CBC");

    recommendations.push("Blood Group & Rh Typing");

    recommendations.push("Vitamin D Test");

    recommendations.push("Blood Sugar Test");
    riskScore += 10;
  }

  // IMPORTANT

  res.json({
    recommendations,

    riskScore,
  });
});

app.get("/nearby-labs", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  try {
    const fetch = (await import("node-fetch")).default;

    const query = `
[out:json];
node["healthcare"="laboratory"](around:5000,${lat},${lon});
out;
`;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        body: query,
      }
    );

    const text = await response.text();

    console.log(text);

    const data = JSON.parse(text);

    const labs = data.elements.map((place) => ({
      name: place.tags.name || "Diagnostic Lab",

      lat: place.lat,

      lon: place.lon,

      address: place.tags["addr:full"] || "Nearby Lab",
    }));

    res.json(labs);
  } catch (error) {
    console.log(error);

    res.send("Error fetching nearby labs");
  }
});

// SAVE REPORT

app.get("/save-report", (req, res) => {
  const email = req.query.email;

  const recommendations = req.query.recommendations;

  const riskScore = req.query.riskScore;

  db.query(
    "INSERT INTO reports (email, recommendations, risk_score) VALUES (?, ?, ?)",

    [email, recommendations, riskScore],

    (err, result) => {
      if (err) {
        console.log(err);

        res.send(err);
      } else {
        res.send("Report Saved Successfully");
      }
    }
  );
});
// GET REPORTS

app.get("/reports/:email", (req, res) => {
  const email = req.params.email;

  db.query(
    "SELECT * FROM reports WHERE email = ? ORDER BY created_at DESC",

    [email],

    (err, result) => {
      if (err) {
        console.log(err);

        res.send(err);
      } else {
        res.json(result);
      }
    }
  );
});

app.get("/my-reports", (req, res) => {
  const email = req.query.email;

  db.query(
    "SELECT * FROM reports WHERE user_email = ? ORDER BY created_at DESC",

    [email],

    (err, result) => {
      if (err) {
        console.log(err);

        res.send(err);
      } else {
        res.json(result);
      }
    }
  );
});
app.get("/nearby-doctors", async (req, res) => {
  const lat = req.query.lat;
  const lon = req.query.lon;

  try {
    const fetch = (await import("node-fetch")).default;

    const query = `
[out:json];
node["amenity"="hospital"](around:5000,${lat},${lon});
out;
`;

    const response = await fetch(
      "https://overpass-api.de/api/interpreter",

      {
        method: "POST",

        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },

        body: query,
      }
    );

    const data = await response.json();

    const doctors = data.elements.map((place) => ({
      name: place.tags.name || "Healthcare Center",

      lat: place.lat,

      lon: place.lon,

      address: place.tags["addr:full"] || "Nearby Healthcare Center",
    }));

    res.json(doctors);
  } catch (error) {
    console.log(error);

    res.send("Error fetching doctors");
  }
});
app.listen(8000, () => {
  console.log("Server running on port 8000");
});

