import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: String,
  city: String,
  address: String,
  lat: Number,
  lon: Number
});

export default mongoose.model("Doctor", doctorSchema);