
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const userManagement = require('../controllers/admin/userManagement')

router.post("/", paymentController.createPayment)
router.get("/", userManagement.getUsersWithPayments);


module.exports = router;

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