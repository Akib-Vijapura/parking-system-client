import logger from '../logger/logger.js';

import User from "../models/User.js"
import bcrypt from "bcrypt";
import { generateUserToken } from "../utils/auth.js";

// @desc    Fetch all products
// @route   GET /api/v1/products
// @access  Public
/*
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
*/


const doLogin = async (req, res) =>  {
  logger.info("login POST route");

  try {
    const body = await req.body;
    const { username, password } = body;
    logger.info(`trying to login with creds =${username}  ${password}`)

    // check if the user already exists
    const user = await User.findOne({username});

    logger.info("got user=",user)

    if (!user) {
      const msg = `User '${username}' doesn't exists`;
      logger.info(msg)
      res.status(400).json({ message: msg});
      return;
    }

    // check if the password is correct

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      const msg = "Invalid Credentials";
      logger.info(msg)
      res.status(401).json({ message: msg });
      return;
    }

    // after we verified the user is valid, we can create a JWT token and return it to the user cookies
    // first create token data
    const userDataToAppendToToken = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
      windowNo: user.windowNo
    };

    // create a next response
    res.status(200).json({
      message: "Logged in successfully",
      token: await generateUserToken(userDataToAppendToToken),
    });

  } catch (err) {
    const msg = "ERROR: doLogin"
    logger.info(`msg=${msg} error=${err}`)
    res.status(500).json({ message: msg, error: err.message });
  }
}




export {
    doLogin
};