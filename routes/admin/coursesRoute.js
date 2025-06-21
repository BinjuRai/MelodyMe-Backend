const express = require('express');
const router = express.Router();
// const {createCategory} = require('../../controllers/admin/categorymanagement');

const coursesController = require('../../controllers/admin/coursesManagement')

const upload = require("../../middlewares/fileupload")

router.post(
    '/', 
    upload.single("image"),
   
    coursesController.createCourse
);
router.get('/', coursesController.getAllCourses);
router.get('/:id', coursesController.getCoursesById);
router.put('/:id', 
    upload.single("image"),
    coursesController.updateCourses);
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;