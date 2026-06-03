import express from "express";
import bcrypt from "bcrypt";
import cors from "cors";
import path from "path";
import mongoose from "mongoose";
import Lab from "./models/Lab.js";
import Doctor from "./models/Doctor.js";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
console.log("MY NEW SERVER FILE LOADED");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));
mongoose.connection.once("open", () => {
  console.log("Connected DB:", mongoose.connection.db.databaseName);
});

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
app.use(cors());

app.get("/", (req, res) => {
  res.send("VowSecure Backend Running");
});

// SEARCH HEALTHCARE LABS
app.get("/search-healthcare/:city", async (req, res) => {
  try {
    const city = req.params.city;

    console.log("Searching city:", city);

    const labs = await Lab.find({
      city: { $regex: city, $options: "i" },
    });

    console.log("Found labs:", labs);

    res.json(labs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
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
  try {
    const userLat = parseFloat(req.query.lat);
    const userLon = parseFloat(req.query.lon);

    const labs = await Lab.find({});

    const nearbyLabs = labs
      .map((lab) => ({
        ...lab.toObject(),
        distance: Math.sqrt(
          Math.pow(userLat - lab.lat, 2) + Math.pow(userLon - lab.lon, 2)
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    res.json(nearbyLabs);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/nearby-doctors", async (req, res) => {
  try {
    const userLat = parseFloat(req.query.lat);
    const userLon = parseFloat(req.query.lon);

    const doctors = await Doctor.find({});

    const nearbyDoctors = doctors
      .map((doctor) => ({
        ...doctor.toObject(),
        distance:
          Math.sqrt(
            Math.pow(userLat - doctor.lat, 2) +
            Math.pow(userLon - doctor.lon, 2)
          )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);

    res.json(nearbyDoctors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});
app.listen(8000, () => {
  console.log("Server running on port 8000");
});
