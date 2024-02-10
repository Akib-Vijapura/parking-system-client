//import logger from '../../logger/logger.js';
import axios from "axios";

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
const doLogin = async (req, res) => {
  //logger.info('getProducts');

  const { username, password } = req.body;
  try {
    console.log("do login");
    const datares =  await axios.post(
      `${process.env.ADMIN_SERVER}/api/login`,
      {
        username,
        password,
      }
    );
    res.status(200).json( datares.data );
  } catch (err) {
    console.error(`Error in getProducts err=${err}`);
    res.status(500);
  }
};


export {
    doLogin,
};