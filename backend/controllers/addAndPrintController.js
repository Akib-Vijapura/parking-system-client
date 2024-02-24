import logger from "../logger/logger.js";
import path, { dirname } from "path";
import Parking from "../models/Parking.js";
import { generateUniqueToken } from "../utils/token.js";


import { Printer, Image } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
import VehicleCharges from "../models/VehicleCharges.js";
// Select the adapter based on your printer type

var isPrinterConnected = false;
var printerDevice;

const checkPrinterConnected = () => {
  logger.info("findPrinter called");
  logger.info(`findPrinter(): isPrinterConnected=${isPrinterConnected}`);
  var device;
  const devices = USB.findPrinter();
  if (devices && devices.length) device = devices[0];

  if (!device) {
    isPrinterConnected = false;
    //throw new Error("Shaim Cannot find printer");
    logger.info("findPrinter(): Cannot find printer");
  } else {
    printerDevice = new USB();
    if (!printerDevice) {
      //throw new Error("Shaim Cannot initiate connection to printer");
      logger.info("findPrinter(): Cannot initiate connection to printer");
      return;
    }
    isPrinterConnected = true;
   
  }
  return isPrinterConnected;
};


const dateOptions = {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  timeZone: "Asia/Kolkata",
  //timeZoneName: 'short',
};

const getDateTimeFormatted = (dateTime) => {
  try {
    const dateObj = new Date(dateTime);
    if (isNaN(dateObj.getTime())) {
      logger.info("Invalid date format");
      return "";
    }

    const formattedDate = new Intl.DateTimeFormat("en-IN", dateOptions).format(
      dateObj
    );
    return formattedDate;
  } catch (error) {
    logger.info(`Error parsing date: ${error}`);
    return "";
  }
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

const saveToDb = async (invoiceNumber, vehicleType, vehicleNumber, vehicleCharge, dateTime_, windowNo, operatorName) => {
  try{
    if( !(invoiceNumber || vehicleType || vehicleNumber || vehicleCharge || dateTime_ || windowNo || operatorName) ) {
      const msg = "ERROR saveToDb:";
      logger.info(`msg=${msg} err=${err}`);
      return 0;
    }

  const vehicle = await Parking.create({
    invoiceNumber,
    vehicleNumber,
    vehicleType,
    dateTime: dateTime_,
    vehicleCharge,
    username: operatorName,
    windowNo
  });

  if(vehicle) {
    return 1;
  } else {
    return 0;
  }

  }catch(err) {
    const msg = "ERROR saveToDb:";
    logger.info(`msg=${msg} err=${err}`);
    return 0;
  }
}

const doPrint = async (invoiceNumber, vehicleType, vehicleNumber, vehicleCharge, dateTime, windowNo, operatorName, logo) => {
  try {
  // const newFormattedDate = getDateTimeFormatted(dateTime);
  // con

  // Convert the input string to a Date object
  var dateObj = new Date(dateTime);

  var datePart = dateObj
    .toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
    .replace(/ /g, "-");

  var timePart = dateObj.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  datePart = datePart.replace(",", "");

  let newVehicleType = "";
  if (vehicleType === "TWO") {
    newVehicleType = "2-WHEELER";
  } else if (vehicleType === "THREE") {
    newVehicleType = "2-WHEELER";
  } else if (vehicleType === "FOUR") {
    newVehicleType = "4-WHEELER";
  } else if (vehicleType === "BUS") {
    newVehicleType = "BUS";
  }


  const image = await Image.load(logo);

  printerDevice.open(async function (err) {
    if (err) {
      const msg = "ERROR doPrint: Cannot open Printer device";
      logger.info(`msg=${msg} err=${err}`);
      return 0;
    }

    // encoding is optional
    const options = { encoding: "GB18030" /* default */ };
    let printer = new Printer(printerDevice, options);

    printer.font("c").align("ct").style("b");
    // ("----------------------------------------")
    printer = await printer.image(image, "D24");
    printer
      .size(2, 2)
      .text("WATER VILLE WATER PARK")
      .size(1, 1)
      .text("By Matadar Group")
      .size(1, 1)
      .text("Himatnagar Bypass, Parabada, Gujarat 383220")
      .size(1, 1)
      .text("---------------------------------------------")
      .size(2, 1)
      .text("PARKING RECEIPT")
      .size(1, 1)
      .text("---------------------------------------------")
      .align("lt")
      .size(2, 1)
      .text(`TOKEN NO   : ${invoiceNumber}`)
      .feed()
      .text(`VEHICLE TY : ${newVehicleType}`)
      .feed()
      .text(`VEHICLE NO : ${vehicleNumber}`)
      .feed()
      .text(`ENTRY DATE : ${datePart}`)
      .feed()
      .text(`ENTRY TIME : ${timePart}`)
      .feed()
      .text(`WINDOW NO  : ${windowNo}`)
      .feed()
      .text(`OPERATOR   : ${operatorName}`)
      .feed()
      .align("ct")
      .size(2, 2)
      .font("C")
      .text(`PAID : ${vehicleCharge}.00`)
      .size(1, 1)
      .text("---------------------------------------------")
      .size(1, 1)
      .text("Thank you for visit")
      .feed();

    // Cut paper
    printer.cut();

    // Close connection
    printer.close();
  });

    
    logger.info("done with print job");
    return 1;
  }catch(err) {
    const msg = "ERROR doPrint:";
    logger.info(`msg=${msg} err=${err}`);
    return 0;
  }

}

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const addAndPrint = async (req, res) => {
  //logger.info('getProducts');
  try {
    if (checkPrinterConnected() == false) {
      const msg = "ERROR: Printer not connected, try again after connecting.";
      logger.info(`doPrintJob err=${msg}`);
      res.status(505).json({ message: msg, error: msg });
      return;
    }

    const body = await req.body;
    var { vehicleNumber, vehicleType, vehicleCharge, dateTime } = body;

    if (!vehicleNumber || !vehicleType || !vehicleCharge || !dateTime) {
        return res.status(401).json({ message: "Please provide all the fields" });
    }

    vehicleNumber = vehicleNumber.toUpperCase();
    vehicleType = vehicleType.toUpperCase();

    //read and compare vehicle charge from db
    const chargeFromDB = await getVehicleCharge(vehicleType);

    if(chargeFromDB !== vehicleCharge) {
        return res.status(402).json({ message: "Vehicle charge is updated, try again." });
    }

    const invoiceNumber = generateUniqueToken(vehicleNumber);
    logger.info(
      `Generated token Number: ${invoiceNumber} for vehicleNumber: ${vehicleNumber}`
    );

    const operatorName = req.user.username;
    const windowNo = req.user.windowNo;
    const dateTime_ = dateTime//Date.now();

    const __dirname = path.resolve();
    const tux = path.join(__dirname, "250x250.png");
    const logo = tux;


    const isSaved = await saveToDb(invoiceNumber, vehicleType, vehicleNumber, vehicleCharge, dateTime_, windowNo, operatorName);
  
    if(isSaved) {
      const isPrintDone = await doPrint(invoiceNumber, vehicleType, vehicleNumber, vehicleCharge, dateTime_, windowNo, operatorName, logo);
      if(isPrintDone) {
        return res.status(200).json({ message: "success printed and saved to db"});
      } else {
        logger.info(`msg=${"error while printing"}`);
        return res.status(502).json({ message: "error while printing"});
      }    
    } else {
      return res.status(402).json({ message: "saved to db failed"});
    }




    }catch(err) {
      const msg = "ERROR addAndPrint:";
      logger.info(`msg=${msg} err=${err}`);
    }
};

export { addAndPrint };
