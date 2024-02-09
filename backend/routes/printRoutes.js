import express from 'express'
import { doPrintJob } from '../controllers/printController.js'

const router = express.Router()

router.route('/')
    .get(doPrintJob)

router.route('/:id')
    .get(doPrintJob)


export default router