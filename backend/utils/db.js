import mongoose from 'mongoose'
import logger from '../logger/logger.js'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
          //authSource: process.env.MONGO_AUTHDB,
          //useUnifiedTopology: true,
        //   useUnifiedTopology: true,
          dbName: "Parking-System",
        });
        logger.info(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        logger.error(`MongoDB Error: ${error}`)
        process.exit(1)
    }
}

export default connectDB;