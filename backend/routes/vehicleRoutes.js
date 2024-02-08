import express from 'express'
import { getVehicle, addVehicle } from '../controllers/vehicleController.js'

const router = express.Router()

router.route('/')
    .get(getVehicle)
    .post(addVehicle)


export default router