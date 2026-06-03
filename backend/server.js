import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import Lab from "./models/Lab.js";

const app = express();
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
app.use(cors());

app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.send("VowSecure Backend Running");
});
// GET ALL LABS

app.get("/Labs", (req, res) => {
  db.query("SELECT * FROM labs", (err, result) => {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      res.send(result);
    }
  });
});


// SEARCH HEALTHCARE LABS
app.get("/search-healthcare/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const labs = await Lab.find({
      city: { $regex: city, $options: "i" }
    });

    res.json(labs);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message
    });
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

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
app.listen(8000, () => {
  console.log("Server running on port 8000");
});
