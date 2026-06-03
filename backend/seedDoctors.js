import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Doctor from "./models/Doctor.js";

dotenv.config();

async function seed() {
  try {
    console.log("STEP 1");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("STEP 2");

    const file = fs.readFileSync("./doctors.json", "utf8");

    console.log("STEP 3");

    const doctors = JSON.parse(file);

    console.log("STEP 4:", doctors.length);

    await Doctor.deleteMany({});

    console.log("STEP 5");

    await Doctor.insertMany(doctors);

    console.log("STEP 6");

    process.exit();

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seed();