import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            //authSource: process.env.MONGO_AUTHDB,
            //useUnifiedTopology: true,
            //useNewUrlParser: true,
            //useCreateIndex: true
        })
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    } catch (error) {
        console.error(`MongoDB Error: ${error}`)
        process.exit(1)
    }
}

export default connectDB;