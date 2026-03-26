import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        min:4
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email already exist"],
        lowercase:true
    },
    password:{
        type:String,
        required:true,
        minlength:[6,"password should be atleast 6 character long"],
        select:false,

    },
    
    role:{
        type:String,
        enum:['customer','vendor','admin'],
        default:"customer",
        lowercase:true
    }
},{timestamps:true})

export const userModel = mongoose.model('user',userSchema)