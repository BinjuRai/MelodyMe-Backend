
// // module.exports = router;

// const express = require("express");
// const router = express.Router();
// const paymentController = require("../controllers/paymentController");
// const userManagement = require("../controllers/admin/userManagement");
// const { authenticateUser } = require("../middlewares/authorizedUser"); // <-- import verifyToken here

// // Create a payment
// router.post("/", authenticateUser, paymentController.createPayment);

// // Routes for user's paid courses
// router.get("/paid-courses", authenticateUser, paymentController.getUserPaidCourses); // user from token
// // router.get('/courses/:userId', authenticateUser, paymentController.getUserPaidCoursesByUserId);
// router.get('/paid-courses/:userId', authenticateUser, paymentController.getPaidCoursesForCurrentUser);

// // router.get("/user/:userId", authenticateUser, paymentController.getUserPaidCoursesByUserId); // admin or other user
// //admin route to get user paid courses by userId
// router.get('/courses/:userId', authenticateUser, paymentController.getUserPaidCoursesByUserId);
// // Summary and admin routes
// router.get("/all", authenticateUser, paymentController.getAllPayments);
// router.get("/users-with-payments", authenticateUser, userManagement.getUsersWithPayments);
// router.get("/summary", authenticateUser, paymentController.getPaymentSummary);

// // Dynamic ID routes (keep last)
// router.get("/:id", authenticateUser, paymentController.getPaymentById);
// router.put("/:id", authenticateUser, paymentController.updatePayment);
// router.delete("/:id", authenticateUser, paymentController.deletePayment);

// module.exports = router;


const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const userManagement = require('../controllers/admin/userManagement');

// Create a payment
router.post("/", paymentController.createPayment);

// Get all payments
router.get("/all", paymentController.getAllPayments);

// Get payment by ID
router.get("/:id", paymentController.getPaymentById);

// Update payment by ID
router.put("/:id", paymentController.updatePayment);

// Delete payment by ID
router.delete("/:id", paymentController.deletePayment);

// Get users with their latest completed payments
router.get("/users-with-payments", userManagement.getUsersWithPayments);

//new trying 
router.get("/payments/user/:userId", paymentController.getPaymentsByUserId);

// to display only paid courses for a user or lessons too
router.get("/user/:userId/completed", paymentController.getCompletedPaymentsForUser);



module.exports = router;