// const express = require('express');
// const router = express.Router();


// const progressController = require('../controllers/admin/userLessonProgressController');
// const { authenticateUser } = require('../middlewares/authorizedUser');  // adjust path as needed
// const { getUserPaidCourses } = require("../controllers/paymentController");


// router.post('/', authenticateUser, progressController.saveProgress);
// router.get('/:lessonId', authenticateUser, progressController.getProgress);
// router.get("/progress/summary", authenticateUser, getProgressSummary);
// router.get("/payments/user", authenticateUser, getUserPaidCourses);

// module.exports = router;
// const express = require('express');
// const router = express.Router();

// const progressController = require('../controllers/admin/userLessonProgressController');
// const { authenticateUser } = require('../middlewares/authorizedUser');
// const { getUserPaidCourses } = require("../controllers/paymentController");

// // Save progress by lessonId param
// router.post('/:lessonId/user-progress', authenticateUser, progressController.saveProgressByParam);

// // Get progress summary (before dynamic routes)
// router.get('/progress/summary', authenticateUser, progressController.getProgressSummary);

// // Get payments of user
// router.get('/payments/user', authenticateUser, getUserPaidCourses);

// // Get progress for a specific lesson
// router.get('/:lessonId/user-progress', authenticateUser, progressController.getProgress);

// const express = require("express");
// const router = express.Router();
// const progressController = require("../controllers/admin/userLessonProgressController");
// const { authenticateUser } = require("../middlewares/authorizedUser");

// router.post("/normal/lessons/:lessonId/user-progress", authenticateUser, async (req, res) => {
//   const { lessonId } = req.params;
//   const userId = req.user.id;
//   const { rating, completed } = req.body;

//   try {
//     const updatedProgress = await updateUserLessonProgress(userId, lessonId, { rating, completed });
//     res.json(updatedProgress);
//   } catch (error) {
//     res.status(500).json({ message: "Failed to save user lesson progress" });
//   }
// });

// router.get("/progress/summary", authenticateUser, progressController.getProgressSummary);
// router.get("/:lessonId/user-progress", authenticateUser, progressController.getProgress);
// router.post("/:lessonId/user-progress", authenticateUser, progressController.saveProgress);


// module.exports = router;

const express = require("express");
const router = express.Router();
const progressController = require("../controllers/admin/userLessonProgressController");
const { authenticateUser } = require("../middlewares/authorizedUser");

// Consistent userId key: _id or id? Adjust accordingly
// Here assuming _id from previous code
router.post("/normal/lessons/:lessonId/user-progress", authenticateUser, async (req, res) => {
  const { lessonId } = req.params;
  const userId = req.user._id; // fixed to _id
  const { rating, completed } = req.body;

  try {
    // Assuming this function exists in your controller, otherwise use progressController.saveProgress
    const updatedProgress = await progressController.saveProgressByParam
      ? await progressController.saveProgressByParam({ userId, lessonId, rating, completed })
      : await progressController.saveProgress({ params: { lessonId }, body: { rating, completed }, user: { _id: userId } }); 

    // Or just call your existing saveProgress method directly as needed

    res.json(updatedProgress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to save user lesson progress" });
  }
});

// Use controller methods directly for these routes
router.get("/progress/summary", authenticateUser, progressController.getProgressSummary);
router.get("/:lessonId/user-progress", authenticateUser, progressController.getProgress);
router.post("/:lessonId/user-progress", authenticateUser, progressController.saveProgress);

module.exports = router;
