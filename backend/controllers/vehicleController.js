//import logger from '../../logger/logger.js';
import axios from "axios";

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const addVehicle = async (req, res) => {
  //logger.info('getProducts');

  const { vehicleNumber, vehicleType } = req.body;
  try {
    console.log("Add Vehicles from Admin Server");
    const datares =  await axios.post(
      `${process.env.ADMIN_SERVER}/api/addvehicle`,
      {
        vehicleNumber,
        vehicleType,
      }
    );
    res.status(200).json( datares.data );
  } catch (err) {
    console.error(`Error in getProducts err=${err}`);
    res.status(500);
  }
};

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const getVehicleDetailsByParkingId = async (req, res) => {
  //logger.info('getProducts');
  try{
    const parkingId = req.params.id;
    console.log("parking id=", parkingId)
    console.log("Get Vehicles from Admin Server")
    const adminResponse = await axios.get(`${process.env.ADMIN_SERVER}/api/getvehicledetails/${parkingId}`);
    //const { vehicleNumber, vehicleType, vehicleCharge, dateTime } =
    //adminResponse.data.vehicleDetails;
    //console.log("res=",adminResponse)
    res.status(200).json(adminResponse.data)
  } catch(err) {
    //logger.error(`Error in getProducts err=${err}`);
    console.log("error=",err)
    res.status(500).json({message: "Error while getting vehicle parking details", error: err})
  }
};

export {
  addVehicle,
  getVehicleDetailsByParkingId,
};