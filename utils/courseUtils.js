const mongoose = require('mongoose');

// Common function to validate course ID
const validateCourseId = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error('Invalid course ID format');
  }
  return new mongoose.Types.ObjectId(id);
};

// Common function to get lessons by course ID
const getLessonsForCourse = async (courseId, transform = false) => {
  const lessons = await Lesson.find({ courseId }).sort({ order: 1 });
  
  if (!lessons || lessons.length === 0) {
    return null;
  }

  if (transform) {
    return lessons.map(lesson => ({
      id: lesson._id,
      title: lesson.title,
      duration: lesson.duration,
      createdAt: lesson.createdAt,
      updatedAt: lesson.updatedAt
    }));
  }
  
  return lessons;
};

// Common function to aggregate lesson data
const aggregateLessonData = async (courseId) => {
  const aggregation = await Lesson.aggregate([
    { $match: { courseId } },
    {
      $group: {
        _id: "$courseId",
        totalPrice: { $sum: "$price" },
        authorNames: { $addToSet: "$authorName" },
        totalDuration: { $push: "$duration" }
      }
    }
  ]);

  const lessonData = aggregation[0] || {
    totalPrice: 0,
    authorNames: [],
    totalDuration: []
  };

  // Calculate total duration
  const totalMinutes = lessonData.totalDuration.reduce((acc, curr) => {
    if (!curr) return acc;
    let hours = 0, minutes = 0;
    const hMatch = curr.match(/(\d+)\s*h/);
    const mMatch = curr.match(/(\d+)\s*m/);
    if (hMatch) hours = parseInt(hMatch[1]);
    if (mMatch) minutes = parseInt(mMatch[1]);
    return acc + hours * 60 + minutes;
  }, 0);

  return {
    totalPrice: lessonData.totalPrice,
    authors: lessonData.authorNames,
    totalDuration: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`
  };
};

module.exports = {
  validateCourseId,
  getLessonsForCourse,
  aggregateLessonData
};