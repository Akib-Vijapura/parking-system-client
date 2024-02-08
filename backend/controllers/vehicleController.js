//import logger from '../../logger/logger.js';


const addVehicleToAdminServer = async (vehicleNumber, vehicleType) => {
  try {
    const res = await axios.post(`${process.env.ADMIN_SERVER}/api/addvehicle`, {
      vehicleNumber,
      vehicleType
    //headers: {
    //    Authorization: 'Bearer YOUR_API_KEY' // Replace with your actual key
    //}
    })
    return res.data
  }catch(err) {

  }
}

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const addVehicle = async (req, res) => {
  //logger.info('getProducts');
  try{
    console.log("Add Vehicles from Admin Server")
    const res = await addVehicleToAdminServer(vehicleNumber,vehicleType)
    res.json({res})
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