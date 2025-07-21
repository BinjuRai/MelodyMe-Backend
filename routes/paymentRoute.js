
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

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const paymentController = require("../controllers/paymentController");
// const userManagement = require('../controllers/admin/userManagement')

// router.post("/", paymentController.createPayment)
// router.get("/", userManagement.getUsersWithPayments);

// router.get("/all", paymentController.getAllPayments);        // Get all payments
// router.get("/:id", paymentController.getPaymentById);        // Get payment by ID
// router.put("/:id", paymentController.updatePayment);         // Update payment by ID
// router.delete("/:id", paymentController.deletePayment);      // Delete payment by ID



// module.exports = router;

// router.post("/", async (req, res) => {
//   const {
//     name,
//     email,
//     paymentMethod,
//     type,
//     courseId,
//     courseName,
//     price,
//     lessonId,
//     lessonName,
//   } = req.body;

//   try {
//     // Save to DB (or trigger notification, etc.)
//     // await db.joinRequests.create({ ...req.body });

//     console.log("Received join request:", req.body);

//     res.status(201).json({ message: "Join request submitted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// });