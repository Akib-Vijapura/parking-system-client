import logger from '../logger/logger.js';
import path, { dirname } from "path";
import Parking from "../models/Parking.js";


import { Printer, Image } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
// Select the adapter based on your printer type

var isPrinterConnected = false;
var printerDevice;


const findPrinter = () => {
  logger.info("findPrinter called")
  logger.info(`findPrinter(): isPrinterConnected=${isPrinterConnected}`)
  var device;
  const devices = USB.findPrinter();
  if (devices && devices.length)
    device = devices[0];
  
  if (!device) {
    isPrinterConnected = false
    //throw new Error("Shaim Cannot find printer");
    logger.warn("findPrinter(): Cannot find printer")
    return
  }else {
    printerDevice = new USB();
    if(!printerDevice) {
      //throw new Error("Shaim Cannot initiate connection to printer");
      logger.warn("findPrinter(): Cannot initiate connection to printer")
      return
    }
    isPrinterConnected = true;
  }
  
}

function delayedFunctionCall(iterations, delay) {
  // Base case: stop calling functions after reaching the desired number of iterations
  if (iterations <= 0) {
    return;
  }

  // Call your function here
  //console.log(`Calling function ${iterations}`);
  findPrinter();

  // Decrement the iteration count
  iterations--;

  // Set a delay and call the function again
  setTimeout(() => {
    delayedFunctionCall(iterations, delay);
  }, delay);
}

function infiniteDelayedFunctionCall(delay) {
  // Call your function here
  //console.log('Calling function');
  findPrinter();

  // Set a delay and call the function again
  setTimeout(() => {
    infiniteDelayedFunctionCall(delay);
  }, delay);
}


// Example usage: Call a function in an infinite loop with a delay of 1000 milliseconds (1 second) between each call
// call function at every half minute ie 30 seconds
infiniteDelayedFunctionCall(1000 * (60/2));

// Example usage: Call a function 5 times with a delay of 1000 milliseconds (1 second) between each call
//delayedFunctionCall(5, 1000);


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
      throw new Error("Invalid date format");
    }

    const formattedDate = new Intl.DateTimeFormat("en-IN", dateOptions).format(
      dateObj
    );
    return formattedDate;
  } catch (error) {
    logger.error(`Error parsing date: ${error}`);
    return "Invalid Date";
  }
};



// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const doPrintJob = async (req, res) => {
  //logger.info('getProducts');
  try {

    if(!isPrinterConnected) {
      const msg = "Printer not connected";
      logger.error(msg)
      res.stats(501).json({ message: msg });
      return
    }

    const parkingId = req.params.id;
    logger.info("parking id=", parkingId);

    const vehicleDetails = await Parking.findById({ _id: id });

    if (!vehicleDetails) {
      const msg = "Vehicle details not found";
      logger.error(msg)
      res.stats(404).json({ message: msg });
      return;
    }
    const vehicleNumber = parkingRes.vehicleNumber;
    const vehicleType = parkingRes.vehicleType;
    const vehicleCharge = parkingRes.vehicleCharge;
    const dateTime = parkingRes.dateTime;

    const newFormattedDate = getDateTimeFormatted(dateTime);

    var inputString = newFormattedDate;

    // Convert the input string to a Date object
    var dateObj = new Date(inputString);

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

    const __dirname = path.resolve();
    const tux = path.join(__dirname, "250x250.png");
    const image = await Image.load(tux);

    printerDevice.open(async function (err) {
      if (err) {
        const msg = "Cannot open Printer device";
        logger.error(`msg=${msg} err=${err}`)
        res.stats(500).json({ message: msg, error: err })
        return;
      }

      // encoding is optional
      const options = { encoding: "GB18030" /* default */ };
      let printer = new Printer(printerDevice, options); 
      
      printer.font("c").align("ct").style("b");
      // ("----------------------------------------")
      printer = await printer.image(image, "D24");
      printer
        .size(2, 2)
        .text("WATER VILLE")
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
        .text("TOKEN NO   : E2423D24")
        .feed()
        .text(`VEHICLE TY : ${newVehicleType}`)
        .feed()
        .text(`VEHICLE NO : ${vehicleNumber}`)
        .feed()
        .text(`ENTRY DATE : ${datePart}`)
        .feed()
        .text(`ENTRY TIME : ${timePart}`)
        .feed()
        .align("ct")
        .size(2, 2)
        .font("C")
        .text(`PAID : ${vehicleCharge}.00`)
        .size(1, 1)
        .text("---------------------------------------------")
        .size(1, 1)
        .text("Thank you for visit")
        .feed()

      // Cut paper
      printer.cut();

      // Close connection
      printer.close();
    });

    logger.info("done with print job");
    res.status(200).json(adminResponse.data)
  } catch (err) {
    //logger.error(`Error in getProducts err=${err}`);
    const msg = "Error while getting vehicle parking details";
    logger.error(`msg=${msg} err=${err}`)
    
    res.status(500).json({
      message: msg,
      error: err,
    });
  }
};

export { doPrintJob };
