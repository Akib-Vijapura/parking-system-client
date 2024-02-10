//import logger from '../../logger/logger.js';

import Parking from "../models/Parking.js"
import VehicleCharges from "../models/VehicleCharges.js"

const getVehicleCharge = async (vehicleType) => {
  let vehicleCharge = 0;
  try {
    const res = await VehicleCharges.find({});
    const data = res[0];
    console.log("getvehiclecharge data ==> ", data, " ", vehicleType);
    if (vehicleType === "TWO") {
      vehicleCharge = data.twoWheeler;
    } else if (vehicleType === "THREE") {
      vehicleCharge = data.threeWheeler;
    } else if (vehicleType === "FOUR") {
      vehicleCharge = data.fourWheeler;
    } else if (vehicleType === "BUS") {
      vehicleCharge = data.bus;
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  } finally {
    return vehicleCharge;
  }
};

const addVehicle = async (req, res) => {
  try {
    const body = await req.body;
    const { vehicleNumber, vehicleType } = body;
    const vehicleNumberToUpper = vehicleNumber.toUpperCase();
    if (!vehicleNumberToUpper || !vehicleType) {
      res.status(401).json({ message: "Please provide all the fields"})
    }
    
    var vehicleCharge = await getVehicleCharge(vehicleType);
    console.log("vehicleCharge ===> ", vehicleCharge);

    const vehicle = await Parking.create({
      vehicleNumber: vehicleNumberToUpper,
      vehicleType,
      vehicleCharge,
    });

    res.status(200).json({
      message: "succuess",
      vehicle,
    })

  } catch (error) {
    console.log("ERROR: Add Vehicle to Parking =", error);
    return res.status(500).json({ message: error.message });
  }
}

const getVehicleDetailsByParkingId = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`got id=`, id)
    const vehicleDetails = await Parking.findById({ _id: id });

    if (!vehicleDetails) {
      res.stats(404).json({ message: "Vehicle details not found" });
    }

    res.status(200).json({
      message: "success",
      vehicleDetails,
    });

  } catch (error) {
    console.log("ERROR: Getting Parking details for Vehicle=",error);
    res.stats(500).json({ message: error.message });
  }
}

export {
  addVehicle,
  getVehicleDetailsByParkingId,
};