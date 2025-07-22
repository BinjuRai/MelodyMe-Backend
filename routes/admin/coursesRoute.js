
// module.exports = router;
const express = require('express');
const router = express.Router();
const coursesController = require('../../controllers/admin/coursesManagement');
const upload = require('../../middlewares/fileupload');

// Create a new course
router.post(
    '/',
    upload.single("image"),
    coursesController.createCourse
);

// Get all courses
router.get('/', coursesController.getAllCourses);

// Get a single course by ID with aggregated lesson info
router.get('/:id', coursesController.getCoursesById);

// Get all lessons by course ID
router.get('/:id/lessons', coursesController.getLessonsByCourseId);

// Update a course
router.put(
    '/:id',
    upload.single("image"),
    coursesController.updateCourses
);

// Delete a course
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;
