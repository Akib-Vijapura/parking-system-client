//import logger from '../../logger/logger.js';

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
  console.log("login POST route");

  try {
    const body = await req.body;
    const { username, password } = body;
    console.log(`login with creds =${username}  ${password}`)

    // check if the user already exists
    const user = await User.findOne({username});

    console.log("got user=",user)

    if (!user) {
      res.status(400).json({ message: `User '${username}' doesn't exists` });
      return;
    }

    // check if the password is correct

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      res.status(401).json({ message: "Invalid Credentials" });
      return;
    }

    // after we verified the user is valid, we can create a JWT token and return it to the user cookies
    // first create token data
    const userDataToAppendToToken = {
      id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    };

    // create a next response
    res.status(200).json({
      message: "Logged in successfully",
      token: generateUserToken(userDataToAppendToToken)
    });

  } catch (error) {
    console.log("ERROR: doLogin =",error);
    res.status(500).json({ message: error.message });
  }
}



export {
    doLogin,
};