import logger from '../logger/logger.js'
import User from '../models/User.js'
import { verifyAuth } from '../utils/auth.js'

const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = token = req.headers.authorization.split(' ')[1]
            const decoded = await verifyAuth(token)

            req.user = await User.findById(decoded.id).select('-password')
            
            next()
        } catch (error) {
            const msg = "Not authorized, token failed"
            logger.error(`auth middleware msg=${msg} error=${error}`)
            res.status(401).json({message: msg, error: error})
        }
    }

    if (!token) {
        const msg = "Not authorized, no token"
        logger.error(`auth middleware msg=${msg} error=${error}`)
        res.status(401).json({message: msg, error: error})
    }

}

const admin = (req , res, next) =>{
    if(req.user && req.user.isAdmin){
        next()
    }else{
        res.status(401)
        throw new Error ("Not authorized as an admin")
    }
}

export { protect, admin  }