//import logger from '../../logger/logger.js';
import axios from "axios";

import { Printer, Image } from "@node-escpos/core";
// install escpos-usb adapter module manually
import USB from "@node-escpos/usb-adapter";
// Select the adapter based on your printer type

const device = new USB();

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const doPrintJob = async (req, res) => {
  //logger.info('getProducts');
  try {
    const parkingId = "65c5fee48b6df2699ab3022e"; //req.params.id;
    console.log("parking id=", parkingId);
    console.log("Get Parking Details of Vehicle from Admin Server");
    const adminResponse = await axios.get(
      `${process.env.ADMIN_SERVER}/api/getvehicledetails/${parkingId}`
    );
    //const { vehicleNumber, vehicleType, vehicleCharge, dateTime } =
    //adminResponse.data.vehicleDetails;
    //console.log("res=",adminResponse)

    device.open(async function (err) {
      if (err) {
        console.log("Printer not found error =  ", err);
        return;
      }

      // encoding is optional
      const options = { encoding: "GB18030" /* default */ };
      let printer = new Printer(device, options);

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
      printer
        .font("a")
        .size(1, 1)
        .text("Bold Text")
        .font("a")
        .text("Normal Text");

      // Alignment
      printer
        .align("lt") // left alignment
        .text("Left aligned text")
        .align("ct") // center alignment
        .text("Center aligned text")
        .align("rt") // right alignment
        .text("Right aligned text");

      // Text size
      printer
        .size(2, 2) // double width, double height
        .text("Large Text")
        .size(1, 1) // normal size
        .text("Normal Text");

      // Underline
      printer
        .control("LF") // Line feed
        .text("Normal text")
        .control("ESC", "-", 1) // Set underline mode to 1-dot width
        .text("Underlined text")
        .control("ESC", "-", 0); // Turn off underline mode

      // Bold
      printer.font("b").text("Bold Text").font("a"); // Switch back to normal font

      // Cut paper
      printer.cut();

      // Close connection
      printer.close();
    });

    console.log("do print job");
    res.status(200).json(adminResponse.data);
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
