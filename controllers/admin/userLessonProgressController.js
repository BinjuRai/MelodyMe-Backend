// const Progress = require('../../models/UserLessonProgress');

// exports.saveProgress = async (req, res) => {
//   const { lessonId, rating, completed } = req.body;
//   console.log("Received progress data in backend:", req.body);

//   const userId = req.user._id;  // use _id, not id

//   try {
//     const progress = await Progress.findOneAndUpdate(
//       { userId, lessonId },
//       { completed, rating },
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );

//     res.status(200).json({ message: 'Progress saved', data: progress });
//   } catch (err) {
//     console.error("Error saving progress:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.getProgress = async (req, res) => {
//   const { lessonId } = req.params;
//   const userId = req.user._id;

//   try {
//     const progress = await Progress.findOne({ userId, lessonId });
//     if (!progress) {
//       return res.status(404).json({ message: "No progress found for this lesson" });
//     }
//     res.status(200).json(progress);
//   } catch (err) {
//     console.error("Error fetching progress:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// exports.getProgressSummary = async (req, res) => {
//   try {
//     const userId = req.user._id;

// //     const progressPerCourse = await Progress.aggregate([
// //       { $match: { userId } },
// //       {
// //         $lookup: {
// //           from: "lessons",
// //           localField: "lessonId",
// //           foreignField: "_id",
// //           as: "lesson",
// //         },
// //       },
// //       { $unwind: "$lesson" },
// //       {
// //         $group: {
// //           _id: "$lesson.courseId",
// //           completedCount: { $sum: { $cond: ["$completed", 1, 0] } },
// //           totalCount: { $sum: 1 },
// //         },
// //       },
// //     ]);

// //     res.status(200).json(progressPerCourse);
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: "Server error" });
// //   }
// // };
// const progressSummary = await Progress.aggregate([
//       { $match: { userId } },
//       {
//         $lookup: {
//           from: "lessons", // collection name for lessons in MongoDB
//           localField: "lessonId",
//           foreignField: "_id",
//           as: "lesson",
//         },
//       },
//       { $unwind: "$lesson" },
//       {
//         $group: {
//           _id: "$lesson.courseId",
//           completedCount: {
//             $sum: { $cond: ["$completed", 1, 0] },
//           },
//           totalCount: { $sum: 1 },
//         },
//       },
//     ]);

//     res.json(progressSummary);
//   } catch (err) {
//     console.error("Error fetching progress summary:", err);
//     res.status(500).json({ message: "Server error fetching progress summary" });
//   }
// };const Progress = require('../../models/UserLessonProgress');

// // POST: Save progress from req.body
// exports.saveProgress = async (req, res) => {
//   const { lessonId, rating, completed } = req.body;
//   const userId = req.user._id;

//   try {
//     const progress = await Progress.findOneAndUpdate(
//       { userId, lessonId },
//       { completed, rating },
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );
//     res.status(200).json({ message: 'Progress saved', data: progress });
//   } catch (err) {
//     console.error("Error saving progress:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // ✅ NEW: Save progress using lessonId from URL params
// exports.saveProgressByParam = async (req, res) => {
//   const { lessonId } = req.params;
//   const { rating, completed } = req.body;
//   const userId = req.user._id;

//   try {
//     const progress = await Progress.findOneAndUpdate(
//       { userId, lessonId },
//       { completed, rating },
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );
//     res.status(200).json({ message: 'Progress saved via param', data: progress });
//   } catch (err) {
//     console.error("Error saving progress by param:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // GET: Progress for specific lesson
// exports.getProgress = async (req, res) => {
//   const { lessonId } = req.params;
//   const userId = req.user._id;

//   try {
//     const progress = await Progress.findOne({ userId, lessonId });
//     if (!progress) {
//       return res.status(404).json({ message: "No progress found for this lesson" });
//     }
//     res.status(200).json(progress);
//   } catch (err) {
//     console.error("Error fetching progress:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // GET: Progress summary for all lessons
// exports.getProgressSummary = async (req, res) => {
//   try {
//     const userId = req.user._id;

//     const progressSummary = await Progress.aggregate([
//       { $match: { userId } },
//       {
//         $lookup: {
//           from: "lessons",
//           localField: "lessonId",
//           foreignField: "_id",
//           as: "lesson",
//         },
//       },
//       { $unwind: "$lesson" },
//       {
//         $group: {
//           _id: "$lesson.courseId",
//           completedCount: { $sum: { $cond: ["$completed", 1, 0] } },
//           totalCount: { $sum: 1 },
//         },
//       },
//     ]);

//     res.status(200).json(progressSummary);
//   } catch (err) {
//     console.error("Error fetching progress summary:", err);
//     res.status(500).json({ message: "Server error fetching progress summary" });
//   }
// };



// exports.saveUserLessonProgress = async (req, res) => {
//   const { rating, completed } = req.body;
//   const userId = req.user._id;
//   const { lessonId } = req.params;

//   try {
//     const progress = await Progress.findOneAndUpdate(
//       { userId, lessonId },
//       { completed, rating },
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );
//     res.status(200).json({ message: 'Progress saved', data: progress });
//   } catch (err) {
//     console.error("Error saving progress:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// const mongoose = require('mongoose');
// const Progress = require('../../models/UserLessonProgress');  // Adjust path as needed

// // Save progress - lessonId from params or body
// exports.saveProgress = async (req, res) => {
//   const lessonId = req.params.lessonId || req.body.lessonId;
//   const { rating, completed } = req.body;
//   const userId = req.user._id;

//   if (!lessonId) {
//     return res.status(400).json({ message: 'Lesson ID is required' });
//   }

//   // Optional validation before saving
//   if (rating !== undefined && (rating < 1 || rating > 5)) {
//     return res.status(400).json({ message: 'Rating must be between 1 and 5' });
//   }

//   try {
//     const progress = await Progress.findOneAndUpdate(
//       { userId, lessonId },
//       { completed, rating },
//       { new: true, upsert: true, setDefaultsOnInsert: true }
//     );
//     res.status(200).json({ message: 'Progress saved', data: progress });
//   } catch (err) {
//     console.error("Error saving progress:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Get progress for specific lesson
// exports.getProgress = async (req, res) => {
//   const { lessonId } = req.params;
//   const userId = req.user._id;

//   if (!lessonId) {
//     return res.status(400).json({ message: 'Lesson ID is required' });
//   }

//   try {
//     const progress = await Progress.findOne({ userId, lessonId });
//     if (!progress) {
//       return res.status(404).json({ message: "No progress found for this lesson" });
//     }
//     res.status(200).json(progress);
//   } catch (err) {
//     console.error("Error fetching progress:", err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };

// // Get progress summary grouped by course
// exports.getProgressSummary = async (req, res) => {
//   try {
//     const userId = mongoose.Types.ObjectId(req.user._id);

//     const progressSummary = await Progress.aggregate([
//       { $match: { userId } },
//       {
//         $lookup: {
//           from: "lessons",
//           localField: "lessonId",
//           foreignField: "_id",
//           as: "lesson",
//         },
//       },
//       { $unwind: "$lesson" },
//       {
//         $group: {
//           _id: "$lesson.courseId",
//           completedCount: { $sum: { $cond: ["$completed", 1, 0] } },
//           totalCount: { $sum: 1 },
//         },
//       },
//     ]);

//     res.status(200).json(progressSummary);
//   } catch (err) {
//     console.error("Error fetching progress summary:", err);
//     res.status(500).json({ message: "Server error fetching progress summary" });
//   }
// };


const mongoose = require('mongoose');
const Progress = require('../../models/UserLessonProgress');

// Save progress (lessonId from params or body)
exports.saveProgress = async (req, res) => {
  const lessonId = req.params.lessonId || req.body.lessonId;
  const { rating, completed } = req.body;
  const userId = req.user._id;

  if (!lessonId) {
    return res.status(400).json({ message: 'Lesson ID is required' });
  }
  if (rating !== undefined && (rating < 1 || rating > 5)) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const progress = await Progress.findOneAndUpdate(
      { userId, lessonId },
      { completed, rating },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.status(200).json({ message: 'Progress saved', data: progress });
  } catch (err) {
    console.error("Error saving progress:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get progress for a specific lesson
exports.getProgress = async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user._id;

  if (!lessonId) {
    return res.status(400).json({ message: 'Lesson ID is required' });
  }

  try {
    const progress = await Progress.findOne({ userId, lessonId });
    if (!progress) {
      return res.status(404).json({ message: "No progress found for this lesson" });
    }
    res.status(200).json(progress);
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getProgressSummary = async (req, res) => {
  try {
    // Use 'new' here!
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const progressSummary = await Progress.aggregate([
      { $match: { userId } },
      {
        $lookup: {
          from: "lessons",
          localField: "lessonId",
          foreignField: "_id",
          as: "lesson",
        },
      },
      { $unwind: "$lesson" },
      {
        $group: {
          _id: "$lesson.courseId",
          completedCount: { $sum: { $cond: ["$completed", 1, 0] } },
          totalCount: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json(progressSummary);
  } catch (err) {
    console.error("Error fetching progress summary:", err);
    res.status(500).json({ message: "Server error fetching progress summary" });
  }
};
