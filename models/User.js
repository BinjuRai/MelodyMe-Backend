const mongoose = require("mongoose")
const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        username: {
            type: String, 
            required: true,
            unique: true
        },
        phoneno:{
            type: Number,
            required:true,
            unique:true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role:{
            type:String,
            default:"normal"
        }
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model(
    "User", UserSchema
)