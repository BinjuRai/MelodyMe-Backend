const mongoose = require('mongoose');

const LessonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 100000000
    },
    authorName: {
      type: String,
      trim: true
    },
    duration: {
      type: String, 
      required: false
    },
    price: {
      type: Number,
      required: true
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Courses',
      required: true
    },

    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    imagepath: {
      type: String
    },
    filepath: {
      type: String
    }
  },
  { timestamps: true } // This adds createdAt and updatedAt automatically
);


module.exports =mongoose.model(
    "Lesson", LessonSchema
)