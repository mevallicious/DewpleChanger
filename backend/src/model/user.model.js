import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        select:false
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    verified:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})



const userModel = mongoose.model("user",userSchema)

export default userModel