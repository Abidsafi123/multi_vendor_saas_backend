import mongoose from "mongoose";




const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    price:{
        type:Number,
        required:true,


    },
    description:{
        type:String,

    },
    stock:{
        type:Number,
        required:true,
        default:0
    },
    store:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'store'
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    image:{
        public_id:String,
        url:String
    }
},{
    timestamps:true
})

const productModel = mongoose.model('product',productSchema)
export default productModel