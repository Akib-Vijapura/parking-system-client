import express from 'express'
import { getVehicleDetailsByParkingId, addVehicle } from '../controllers/vehicleController.js'

const router = express.Router()

router.route('/')
    .post(addVehicle)

router.route('/:id')
    .get(getVehicleDetailsByParkingId)


export default router