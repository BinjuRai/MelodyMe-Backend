 const express = require("express")
const router = express.Router()
const lessonController = require("../../controllers/admin/lessonContentManagement")


router.post(
    "/",
    lessonController.createLesson// using dot, get function
)
router.get(
    "/",
    lessonController.getLesson
)
module.exports = router