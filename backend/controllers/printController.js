//import logger from '../../logger/logger.js';
import axios from "axios";

import { Printer, Image } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
// Select the adapter based on your printer type

var isPrinterConnected = false;
var printerDevice;


const findPrinter = () => {
  console.log("findPrinter called")
  var device;
  const devices = USB.findPrinter();
  if (devices && devices.length)
    device = devices[0];
  
  if (!device) {
    isPrinterConnected = false
    //throw new Error("Shaim Cannot find printer");
    console.log("Shaim Cannot find printer")
    return
  }else {
    printerDevice = new USB();
    if(!printerDevice) {
      //throw new Error("Shaim Cannot initiate connection to printer");
      console.log("Shaim Cannot initiate connection to printer")
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


// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const doPrintJob = async (req, res) => {
  //logger.info('getProducts');
  try {

    if(!isPrinterConnected) {
      res.stats(501).json({ message: "Printer not connected" });
      return
    }

    const parkingId = "65c5fee48b6df2699ab3022e"; //req.params.id;
    console.log("parking id=", parkingId);
    console.log("Get Parking Details of Vehicle from Admin Server");

    const vehicleDetails = await Parking.findById({ _id: id });

    if (!vehicleDetails) {
      res.stats(404).json({ message: "Vehicle details not found" });
      return;
    }
    //const { vehicleNumber, vehicleType, vehicleCharge, dateTime } =
    //adminResponse.data.vehicleDetails;
    //console.log("res=",adminResponse)

    printerDevice.open(async function (err) {
      if (err) {
        res.stats(500).json({ message: "Cannot open Printer device", error: err })
        return;
      }

      // encoding is optional
      const options = { encoding: "GB18030" /* default */ };
      let printer = new Printer(printerDevice, options); 
      // Path to png image
      //const filePath = "./logo.png";
      //const image = await Image.load("./logo.png");

      /*printer
        .font("b")
        .align("ct")
        // .style("bu")
        .size(2, 2)
        .text("WATER VILLE")
        .size(1, 1)
        .text("HMT 383001")
        .size(1, 1)
        .text("-------------------")
        .size(2, 2)
        .text("PARKING RECEIPT")
        .size(1, 1)
        .text("-------------------")
        .size(2, 2)
        .text("12:00 PM")
        .size(1, 1)
        .text("09-Feb-2024")
        .size(2, 2)
        .text("PAID : 30.00")
        .size(1, 1)
        .text("--------------")
        .size(1, 1)
        .text("Thank you for visit");

      printer.cut().close();*/
      // Font styles
      printerDevice
        .font("a")
        .size(1, 1)
        .text("Bold Text")
        .font("a")
        .text("Normal Text");

      // Alignment
      printerDevice
        .align("lt") // left alignment
        .text("Left aligned text")
        .align("ct") // center alignment
        .text("Center aligned text")
        .align("rt") // right alignment
        .text("Right aligned text");

      // Text size
      printerDevice
        .size(2, 2) // double width, double height
        .text("Large Text")
        .size(1, 1) // normal size
        .text("Normal Text");

      // Underline
      printerDevice
        .control("LF") // Line feed
        .text("Normal text")
        .control("ESC", "-", 1) // Set underline mode to 1-dot width
        .text("Underlined text")
        .control("ESC", "-", 0); // Turn off underline mode

      // Bold
      printerDevice.font("b").text("Bold Text").font("a"); // Switch back to normal font

      // Cut paper
      printerDevice.cut();

      // Close connection
      printerDevice.close();
    });

    console.log("do print job");
    res.status(200).json(adminResponse.data)
  } catch (err) {
    //logger.error(`Error in getProducts err=${err}`);
    console.log("error=", err);
    res.status(500).json({
      message: "Error while getting vehicle parking details",
      error: err,
    });
  }
};

export { doPrintJob };
