import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const connectDb = async()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        if(conn){
            console.log("Connection successfull with mongodb atlas")
        }
        
    } catch (error) {
        console.log("Connection failed with mongodb atlas",error)

        process.exit(1)
    }
}
export default connectDb