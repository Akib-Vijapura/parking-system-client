//import logger from '../../logger/logger.js';

import Parking from "../models/Parking.js";
import VehicleCharges from "../models/VehicleCharges.js";
import logger from "../logger/logger.js";

import USB from "@node-escpos/usb-adapter";
// Select the adapter based on your printer type


const checkPrinterConnected = () => {
    var isPrinterConnected = false;
    var printerDevice;
  logger.info("findPrinter called");
  logger.info(`findPrinter(): isPrinterConnected=${isPrinterConnected}`);
  var device;
  const devices = USB.findPrinter();
  if (devices && devices.length) {
    device = devices[0];
  }
  
  if (device == undefined) {
    isPrinterConnected = false;
    logger.info(`findPrinter(): Cannot find printer device=${device}`);
  } else if(!device) {
    isPrinterConnected = false;
    logger.info(`findPrinter(): Cannot find printer device=${device}`);
  } else {
    printerDevice = new USB();
    if (!printerDevice) {
      logger.info("findPrinter(): Cannot initiate connection to printer");
    }
    isPrinterConnected = true;
   
  }
  return isPrinterConnected;
};

const getVehicleCharge = async (vehicleType) => {
  let newVehicleCharge = 0;
  try {
    const res = await VehicleCharges.find({});
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
    logger.info(`msg=${msg} err=${err}`);

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

  // Combine the obfuscated vehicle number and formatted time to create the unique token
  const uniqueToken = shortenToken(
    `${obfuscatedVehicleNumber}${formattedTime}`
  );

  return uniqueToken;
}

const addVehicleToParking = async (req, res) => {
  try {

    if(checkPrinterConnected() == false) {
      const msg = "ERROR: Printer not connected, try again after connecting.";
      logger.info(`${msg}`);
      return res.status(505).json({ message: msg, error: msg });
    }

    const body = await req.body;
    var { vehicleNumber, vehicleType } = body;
    const vehicleNumberToUpper = vehicleNumber.toUpperCase();
    if (!vehicleNumberToUpper || !vehicleType) {
      return res.status(401).json({ message: "Please provide all the fields" });
    }

    // const res = await VehicleCharge.find({});
    // console.log("res = ", res);
    vehicleType = vehicleType.toUpperCase();
    var vehicleCharge = await getVehicleCharge(vehicleType);
    logger.info(`vehicleCharge ===> ${vehicleCharge}`);

    const invoiceNumber = generateUniqueToken(vehicleNumberToUpper);
    logger.info(
      `Generated token Number: ${invoiceNumber} for vehicleNumber: ${vehicleNumber}`
    );

    const username = req.user.username;
    const windowNo = req.user.windowNo;

    const vehicle = await Parking.create({
      invoiceNumber,
      vehicleNumber: vehicleNumberToUpper,
      vehicleType,
      vehicleCharge,
      username,
      windowNo
    });

    res.status(200).json({
      message: "succuess",
      vehicle,
    });
  } catch (err) {
    const msg = "ERROR: Add Vehicle to Parking";
    logger.info(`msg=${msg} err=${err}`);
    return res.status(500).json({ message: err.message });
  }
};

const getVehicleDetailsByParkingId = async (req, res) => {
  try {
    const id = req.params.id;

    if(!id || id === null) {
      const msg = "Provide parking id";
      logger.info(`msg=${msg}`);
      return res.stats(404).json({ message: msg });
    }

    const vehicleDetails = await Parking.findById({ _id: id });

    if (!vehicleDetails) {
      const msg= "Vehicle details not found";
      logger.info(`msg=${msg}`);
      return res.stats(404).json({ message: msg });
    }

    res.status(200).json({
      message: "success",
      vehicleDetails,
    });
  } catch (err) {
    const msg = "ERROR: Getting Parking details for Vehicle";
    logger.info(`msg=${msg} err=${err}`);
    return res.stats(500).json({ message: msg, error: err.message });
  }
};

const getVehicleChargeByType = async (req, res) => {
  try {
    //logger.info("getCurrentVehicleChargeByType")
    var vtype = req.params.type;
    vtype = vtype.toUpperCase();
    const vehicleCharge = await getVehicleCharge(vtype);

    if (!vehicleCharge) {
      logger.info(`msg=Vehicle charge fetching failed`);
      return res.stats(404).json({ message: "Vehicle charge fetching failed" });
    }

    res.status(200).json({
      message: "success",
      vehicleCharge,
    });
  } catch (err) {
    const msg = "ERROR: Vehicle charge fetching failed";
    logger.info(`msg=${msg} err=${err}`);
    return res.stats(500).json({ message: msg, error: err.message });
  }
};

export { addVehicleToParking, getVehicleDetailsByParkingId, getVehicleChargeByType };
