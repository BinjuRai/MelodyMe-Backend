const mongoose = require('mongoose');
const Lesson = require('../models/admin/lesson');
const Courses = require('../models/admin/courses');

const updateCourseTotalPrice = async (courseId) => {
  try {
    const result = await Lesson.aggregate([
      { $match: { courseId: new mongoose.Types.ObjectId(courseId) } },
      {
        $group: {
          _id: '$courseId',
          totalPrice: { $sum: '$price' },
        }
      }
    ]);

    const totalPrice = result[0]?.totalPrice || 0;

    await Courses.findByIdAndUpdate(courseId, { totalPrice });

    return totalPrice;
  } catch (err) {
    console.error("Failed to update total course price:", err);
  }
};

module.exports = updateCourseTotalPrice;
