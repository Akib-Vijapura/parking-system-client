import mongoose from "mongoose";

const VehicleChargeSchema = mongoose.Schema({
  twoWheeler: {
    type: Number,
    default: 30,
  },
  threeWheeler: {
    type: Number,
    default: 50,
  },
  fourWheeler: {
    type: Number,
    default: 80,
  },
  bus: {
    type: Number,
    default: 100,
  },
});

const VehicleCharges =
  mongoose.models.VehicleCharge ||
  mongoose.model("VehicleCharge", VehicleChargeSchema);
export default VehicleCharges;
