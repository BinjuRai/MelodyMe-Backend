
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
