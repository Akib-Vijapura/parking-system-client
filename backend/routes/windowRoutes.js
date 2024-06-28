import express from "express"
const router = express.Router()

import getEntries from "../controllers/todayController.js"
import {protect} from "../middleware/authMiddleware.js"


router.route("/today").get(protect,getEntries)


export default router