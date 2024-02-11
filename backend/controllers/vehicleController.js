//import logger from '../../logger/logger.js';

import Parking from "../models/Parking.js";
import VehicleCharges from "../models/VehicleCharges.js";
import logger from "../logger/logger.js";

const getVehicleCharge = async (vehicleType) => {
  let newVehicleCharge = 0;
  try {
    const res = await VehicleCharges.find({});
    console.log("res = ", res);
    const data = res[0];
    logger.info(`getVehicleCharge(): data ==> ${data} ${vehicleType}`);
    if (vehicleType === "TWO") {
      newVehicleCharge = data.twoWheeler;
    } else if (vehicleType === "THREE") {
      newVehicleCharge = data.threeWheeler;
    } else if (vehicleType === "FOUR") {
      newVehicleCharge = data.fourWheeler;
    } else if (vehicleType === "BUS") {
      newVehicleCharge = data.bus;
    }

    return newVehicleCharge;
  } catch (err) {
    const msg = "Not able to get vehicle charge";
    logger.error(`msg=${msg} err=${err}`);

    //return //res.status(500).json({ message: msg, error: err.message });
  }
};

function shortenToken(token) {
  // Truncate the token to 8 characters
  const truncatedToken = token.slice(0, 8);

  // Convert the truncated token to a numeric value
  const numericValue = parseInt(truncatedToken, 36);

  // Use modulo to bring it down to 6 digits
  const shortenedNumericValue = numericValue % 1000000;

  // Convert back to a string and pad with zeros if needed
  const shortenedToken = shortenedNumericValue.toString().padStart(6, "0");

  return shortenedToken;
}

function obfuscateVehicleNumber(vehicleNumber) {
  // Simple obfuscation logic: take only the first 3 characters and add some random characters
  const obfuscatedVehicleNumber =
    vehicleNumber.slice(0, 3) + Math.random().toString(36).substring(2, 6);

  return obfuscatedVehicleNumber;
}

function generateUniqueToken(vehicleNumber) {
  // Obfuscate the vehicle number
  const obfuscatedVehicleNumber = obfuscateVehicleNumber(vehicleNumber);

  // Get the current timestamp
  const timestamp = Date.now();

  // Format the current time as a string (e.g., 'YYYYMMDDHHmmss')
  const formattedTime = new Date(timestamp)
    .toISOString()
    .replace(/[-:T.]/g, "");

  console.log(`${obfuscatedVehicleNumber}${formattedTime}`);
  // Combine the obfuscated vehicle number and formatted time to create the unique token
  const uniqueToken = shortenToken(
    `${obfuscatedVehicleNumber}${formattedTime}`
  );

  return uniqueToken;
}

const addVehicle = async (req, res) => {
  try {
    const body = await req.body;
    const { vehicleNumber, vehicleType } = body;
    const vehicleNumberToUpper = vehicleNumber.toUpperCase();
    if (!vehicleNumberToUpper || !vehicleType) {
      res.status(401).json({ message: "Please provide all the fields" });
    }

    // const res = await VehicleCharge.find({});
    // console.log("res = ", res);
    var vehicleCharge = await getVehicleCharge(vehicleType);
    logger.info(`vehicleCharge ===> ${vehicleCharge}`);

    const invoiceNumber = generateUniqueToken(vehicleNumberToUpper);
    logger.info(
      `Generated token Number: ${invoiceNumber} for vehicleNumber: ${vehicleNumber}`
    );

    const vehicle = await Parking.create({
      invoiceNumber,
      vehicleNumber: vehicleNumberToUpper,
      vehicleType,
      vehicleCharge,
    });

    res.status(200).json({
      message: "succuess",
      vehicle,
    });
  } catch (err) {
    const msg = "ERROR: Add Vehicle to Parking";
    logger.error(`msg=${msg} err=${err}`);
    console.log("ERROR: Add Vehicle to Parking =", error);
    return res.status(500).json({ message: err.message });
  }
};

const getVehicleDetailsByParkingId = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(`got id=`, id);
    const vehicleDetails = await Parking.findById({ _id: id });

    if (!vehicleDetails) {
      res.stats(404).json({ message: "Vehicle details not found" });
    }

    res.status(200).json({
      message: "success",
      vehicleDetails,
    });
  } catch (err) {
    const msg = "ERROR: Getting Parking details for Vehicle";
    logger.error(`msg=${msg} err=${err}`);
    res.stats(500).json({ message: msg, error: err.message });
  }
};

export { addVehicle, getVehicleDetailsByParkingId };
