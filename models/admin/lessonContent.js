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
            type: mongoose.Schema.ObjectId, // foreign key/referencing
            ref: 'Courses',
            required: true
        },
        sellerId: {
            type: mongoose.Schema.ObjectId, // foreign key/referencing
            ref: 'User',
            required: true
        },
        // task make a multer to storage product image 
        // courseImage : { type: String }
    }
)


module.exports =mongoose.model(
    "Lesson content", LessonContentSchema
)