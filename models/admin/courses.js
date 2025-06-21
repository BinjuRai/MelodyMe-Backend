const mongoose = require('mongoose');

const CoursesSchema = new mongoose.Schema(
    {
        name:{
            type: String, 
            required: true,
            unique: true
        },
        filepath: {
            type: String
        }
    }
)
module.exports =mongoose.model(
    "Courses", CoursesSchema
)