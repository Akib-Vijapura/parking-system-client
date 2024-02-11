import express from 'express'
import { doPrintJob } from '../controllers/printController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// router.route('/')
//     .get(protect, doPrintJob)

router.route('/:id')
    .get(protect, doPrintJob)


export default router