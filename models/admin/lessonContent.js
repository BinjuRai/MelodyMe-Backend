const mongoose = require('mongoose');

const LessonContentSchema = new mongoose.Schema(
   {
        name: {
            type: String, 
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        courseId: {
            type: mongoose.Schema.ObjectId, 
            ref: 'Courses',
            required: true
        },
        sellerId: {
            type: mongoose.Schema.ObjectId, 
            ref: 'User',
            required: true
        },
       
    }
)

module.exports =mongoose.model(
    "Lesson content", LessonContentSchema
)