import mongoose from "mongoose";
const storeSchema = new mongoose.Schema({
    storeName:{
        type:String,
        required:true,
        trim:true,

    },
    description:{
        type:String,
        

    },

    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user',

    },
    isApproved:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})
const storeModel = mongoose.model('store',storeSchema)
export default storeModel
