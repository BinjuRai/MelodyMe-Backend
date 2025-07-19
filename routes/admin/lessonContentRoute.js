// const express = require('express');
// const router = express.Router();


// const upload = require('../../middlewares/fileupload'); // ✅ use your multer config
// const lessonController = require('../../controllers/admin/lessonContentManagement');
// const { authenticateUser} = require("../../middlewares/authorizedUser")

// // router.post('/', upload.fields([
// //   { name: 'image', maxCount: 1 },
// //   { name: 'file', maxCount: 1 }
// // ]), authenticateUser, lessonController.createLesson);

// router.post(
//     '/', 
//     upload.fields(
//       [
//         { name: 'image', maxCount: 1 },
//         { name: 'file', maxCount: 1 }
//       ]
//     ),
//     authenticateUser, lessonController.createLesson
// );

// router.get('/', lessonController.getLesson);



// router.get('/:id', lessonController.getLessonById);


// // router.put('/:id', upload.fields([
// //   { name: 'image', maxCount: 1 },
// //   { name: 'file', maxCount: 1 }
// // ]), lessonController.updateLesson);
// router.put(
//   '/:id',
//   upload.fields([
//     { name: 'image', maxCount: 1 },
//     { name: 'file', maxCount: 1 }
//   ]),
//   authenticateUser,
//   lessonController.updateLesson
// );



// router.delete('/:id', lessonController.deleteLesson);

// module.exports = router;

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
