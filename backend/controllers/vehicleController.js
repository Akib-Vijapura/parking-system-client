//import logger from '../../logger/logger.js';

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const addVehicle = async (req, res) => {
  //logger.info('getProducts');
  try{
    console.log("Add Vehicles from Admin Server")
    res.json({})
  } catch(err) {
    //logger.error(`Error in getProducts err=${err}`);
    res.status(500)
  }
};

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const getVehicle = async (req, res) => {
  //logger.info('getProducts');
  try{
    console.log("Get Vehicles from Admin Server")
    res.json({})
  } catch(err) {
    //logger.error(`Error in getProducts err=${err}`);
    res.status(500)
  }
};

export {
  getVehicle,
  addVehicle,
};