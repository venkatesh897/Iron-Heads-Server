import {mongoose} from 'mongoose'

export const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please Provide Unique Username"],
        unique:[true, "User name exist"]
    },
    password:
    {
        type:String,
        required:[true,"Please Provide password"],
        unique:false,

    },
    email:
    {
        type:String,
        required:[true,"Please Provide email"],
        unique:true,
    },
    firstName:{type:String},
    lastName:{type:String},
    mobile:{type:Number},
    Weight:{type:Number},
    Height:{type:Number}
})

export default mongoose.model('User',UserSchema)