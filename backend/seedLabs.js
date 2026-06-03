import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Lab from "./models/Lab.js";

dotenv.config();

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");

    const labs = JSON.parse(
      fs.readFileSync("./labs.json", "utf8")
    );

    await Lab.deleteMany({}); 

    await Lab.insertMany(labs);

    console.log(`${labs.length} labs inserted successfully!`);

    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seed();