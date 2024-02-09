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
  try{
    const parkingId = "65c5fee48b6df2699ab3022e"//req.params.id;
    console.log("parking id=", parkingId)
    console.log("Get Parking Details of Vehicle from Admin Server")
    const adminResponse = await axios.get(`${process.env.ADMIN_SERVER}/api/getvehicledetails/${parkingId}`);
    //const { vehicleNumber, vehicleType, vehicleCharge, dateTime } =
    //adminResponse.data.vehicleDetails;
    //console.log("res=",adminResponse)

    device.open(async function(err){
        if(err){
          // handle error
          return
        }
      
        // encoding is optional
        const options = { encoding: "GB18030" /* default */ }
        let printer = new Printer(device, options);
      
        // Path to png image
        //const filePath = "./logo.png";
        //const image = await Image.load("./logo.png");
      
        printer
          .font("a")
          .align("ct")
          .style("bu")
          .size(1, 1)
          .text("May the gold fill your pocket")
          .text("恭喜发财")
          .barcode(112233445566, "EAN13", { width: 50, height: 50 })
          .table(["One", "Two", "Three"])
          .tableCustom(
            [
              { text: "Left", align: "LEFT", width: 0.33, style: "B" },
              { text: "Center", align: "CENTER", width: 0.33 },
              { text: "Right", align: "RIGHT", width: 0.33 },
            ],
            { encoding: "cp857", size: [1, 1] }, // Optional
          )
          
        // inject qrimage to printer
        printer = await printer.qrimage("https://github.com/node-escpos/driver")
        // inject image to printer
        //printer = await printer.image(
          //image, 
          //"s8" // changing with image
        //)
      
        printer
          .cut()
          .close()
      });

    console.log("do print job")
    res.status(200).json(adminResponse.data)
  } catch(err) {
    //logger.error(`Error in getProducts err=${err}`);
    console.log("error=",err)
    res.status(500).json({message: "Error while getting vehicle parking details", error: err})
  }
};

export {
    doPrintJob,
};