

const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/fileupload');
const lessonController = require('../../controllers/admin/lessonContentManagement');
const { authenticateUser } = require("../../middlewares/authorizedUser");

// Create a lesson
router.post(
  '/',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]),
  authenticateUser,
  lessonController.createLesson
);

// Get lessons with pagination/search
router.get('/', lessonController.getLesson);

// Get lesson by ID
router.get('/:id', lessonController.getLessonById);

// Update lesson
router.put(
  '/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
  ]),
  authenticateUser,
  lessonController.updateLesson
);

// Delete lesson
router.delete('/:id', authenticateUser, lessonController.deleteLesson);

module.exports = router;
