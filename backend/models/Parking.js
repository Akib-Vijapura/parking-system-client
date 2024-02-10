import mongoose from "mongoose";

const parkingSchema = new mongoose.Schema({
  vehicleNumber: {
    type: String,
    required: [true, "Please add vehicle number"],
  },
  vehicleType: {
    type: String,
    enum: ["TWO", "THREE", "FOUR", "BUS"],
    required: [true, "Please add vehicle type"],
  },
  vehicleCharge: {
    type: Number,
    default: 10,
  },
  dateTime: {
    type: Date,
    default: Date.now(),
  },
});

const Parking =
  mongoose.models.Parking || mongoose.model("Parking", parkingSchema);
export default Parking;
