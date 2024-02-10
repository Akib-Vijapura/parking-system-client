import express from 'express'
import { doLogin } from '../controllers/loginController.js'

const router = express.Router()

router.route('/')
    .post(doLogin)


export default router