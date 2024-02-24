import express from 'express'
import { getVehicleDetailsByParkingId, addVehicleToParking, getVehicleChargeByType } from '../controllers/vehicleController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .post(protect, addVehicleToParking)

router.route('/:id')
    .get(protect, getVehicleDetailsByParkingId)

router.route('/charge/:type')
    .get(protect, getVehicleChargeByType)


export default router