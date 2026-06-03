import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
  name: String,
  city: String,
  address: String,
  lat: Number,
  lon: Number
});

export default mongoose.model("Lab", labSchema);