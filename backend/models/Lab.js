import mongoose from "mongoose";

const labSchema = new mongoose.Schema({
  name: String,
  city: String,
  address: String,
  lat: Number,
  lon: Number
});

const Lab = mongoose.model("Lab", labSchema);

export default Lab;