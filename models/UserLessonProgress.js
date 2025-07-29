const mongoose = require('mongoose');

const userLessonProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  completed: { type: Boolean, default: false },
  rating: { type: Number, min: 1, max: 5, default: 1 },  // default 1 to avoid validation error
}, { timestamps: true });

userLessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

module.exports = mongoose.model('UserLessonProgress', userLessonProgressSchema);
