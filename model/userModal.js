import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    userName: {
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type:String
    },
    googleId:{
        type:String
    },
    savedMovie:{
        type:[],
        default:[]
    }
},{timestamps:true})

const User = mongoose.model("user",userSchema)
export default User