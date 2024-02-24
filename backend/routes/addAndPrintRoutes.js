import express from 'express'
import { addAndPrint } from '../controllers/addAndPrintController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
    .post(protect, addAndPrint)


export default router