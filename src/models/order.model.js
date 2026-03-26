import mongoose from "mongoose"
const orderSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
    },
    orderItems:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'product',
                required:true
            },
            name:String,
            quantity:Number,
            price:Number

        }
    ],
    shippingAddress:{
        address:String,
        city:String,
        country:String
    },
    totalPrice:{
        type:Number,
        required:true
    },
    orderStatus:{
        type:String,
        default:"Processing"
    }
},{timeStamps:true})
const orderModel = mongoose.model('order',orderSchema)
export default orderModel