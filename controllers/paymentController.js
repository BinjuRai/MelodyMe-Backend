const Payment = require("../models/payment"); // Adjust path if needed
const Courses = require("../models/admin/courses");
const Lesson = require("../models/admin/lesson");
const User = require("../models/User");

// exports.createPayment = async (req, res) => {
//   try {
//     const {
//       userId,
//       paymentMethod,
//       type,        // "course" or "lesson"
//       courseId,
//       lessonId,    // optional if type === "course"
//     } = req.body;

//     if (!userId || !type || !courseId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Validate 'type'
//     if (!["course", "lesson"].includes(type)) {
//       return res.status(400).json({ message: "Invalid type. Must be 'course' or 'lesson'." });
//     }

//     // Fetch course (to get price)
//     const course = await Courses.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     let pricePaid;
//     if (type === "course") {
//       // Full course payment
//       pricePaid = course.totalPrice;
//     } else if (type === "lesson") {
//       if (!lessonId) {
//         return res.status(400).json({ message: "lessonId is required for lesson payment" });
//       }

//       const lesson = await Lesson.findById(lessonId);
//       if (!lesson) {
//         return res.status(404).json({ message: "Lesson not found" });
//       }
//       pricePaid = lesson.price;
//     }

//     // Create payment
//     const payment = new Payment({
//       userId,
//       courseId,
//       lessonId: type === "lesson" ? lessonId : null,
//       pricePaid,
//       paymentMethod: paymentMethod || "unknown",
//       paymentStatus: "completed", // or "pending" if you want to handle async payments
//     });

//     await payment.save();

//     return res.status(201).json({ message: "Payment recorded successfully", payment });
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// exports.createPayment = async (req, res) => {
//   try {
//     const {
//       userId,
//       username,
//       paymentMethod,
//       type,        // "course" or "lesson"
//       courseId,
//       lessonId,    // optional if type === "course"
//     } = req.body;

//     if (!userId || !type || !courseId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     // Validate 'type'
//     if (!["course", "lesson"].includes(type)) {
//       return res.status(400).json({ message: "Invalid type. Must be 'course' or 'lesson'." });
//     }

//     // Fetch course to ensure it exists
//     const course = await Courses.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     let pricePaid;
//     if (type === "course") {
//       // Dynamically calculate total course price by summing all lesson prices under this course
//       const lessons = await Lesson.find({ courseId });
//       if (!lessons.length) {
//         return res.status(400).json({ message: "Course has no lessons to pay for" });
//       }
//       pricePaid = lessons.reduce((sum, lesson) => sum + lesson.price, 0);
//     } else if (type === "lesson") {
//       if (!lessonId) {
//         return res.status(400).json({ message: "lessonId is required for lesson payment" });
//       }

//       const lesson = await Lesson.findById(lessonId);
//       if (!lesson) {
//         return res.status(404).json({ message: "Lesson not found" });
//       }
//       pricePaid = lesson.price;
//     }

//     // Create payment record
//     const payment = new Payment({
//       userId,
//       username,
//       courseId,
//       lessonId: type === "lesson" ? lessonId : null,
//       pricePaid,
//       paymentMethod: paymentMethod || "unknown",
//       paymentStatus: "pending", // or "pending" if async payment handling
//     });

//     await payment.save();

//     return res.status(201).json({ message: "Payment recorded successfully", payment });
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };



// exports.createPayment = async (req, res) => {
//   try {
//     const { userId, paymentMethod, type, courseId, lessonId } = req.body;

//     if (!userId || !type || !courseId) {
//       return res.status(400).json({ message: "Missing required fields" });
//     }

//     if (!["course", "lesson"].includes(type)) {
//       return res.status(400).json({ message: "Invalid type" });
//     }

//     const user = await User.findById(userId);
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const course = await Courses.findById(courseId);
//     if (!course) return res.status(404).json({ message: "Course not found" });

//     let pricePaid;
//     if (type === "course") {
//       const lessons = await Lesson.find({ courseId });
//       if (!lessons.length) return res.status(400).json({ message: "No lessons found for course" });
//       pricePaid = lessons.reduce((sum, lesson) => sum + (lesson.price || 0), 0);
//     } else {
//       if (!lessonId) return res.status(400).json({ message: "lessonId required for lesson payment" });
//       const lesson = await Lesson.findById(lessonId);
//       if (!lesson) return res.status(404).json({ message: "Lesson not found" });
//       pricePaid = lesson.price;
//     }

//     const payment = new Payment({
//       userId,
//       username: user.username,  // pulled from DB
//       courseId,
//       lessonId: type === "lesson" ? lessonId : null,
//       pricePaid,
//       paymentMethod: paymentMethod || "unknown",
//       paymentStatus: "pending",
//     });

//     await payment.save();

//     return res.status(201).json({ message: "Payment recorded successfully", payment });
//   } catch (error) {
//     console.error("Error creating payment:", error);
//     return res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// // Fetch all payments
// exports.getAllPayments = async (req, res) => {
//   try {
//     const payments = await Payment.find().sort({ createdAt: -1 }); // recent first
//     res.json(payments);
//   } catch (error) {
//     console.error("Error fetching payments:", error);
//     res.status(500).json({ message: "Server error fetching payments" });
//   }
// };

// // Fetch one payment by ID
// exports.getPaymentById = async (req, res) => {
//   try {
//     const payment = await Payment.findById(req.params.id);
//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }
//     res.json(payment);
//   } catch (error) {
//     console.error("Error fetching payment:", error);
//     res.status(500).json({ message: "Server error fetching payment" });
//   }
// };

// // Update payment (e.g., paymentStatus)
// exports.updatePayment = async (req, res) => {
//   try {
//     const { paymentStatus, paymentMethod, pricePaid } = req.body;

//     const payment = await Payment.findById(req.params.id);
//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }

//     if (paymentStatus) payment.paymentStatus = paymentStatus;
//     if (paymentMethod) payment.paymentMethod = paymentMethod;
//     if (pricePaid) payment.pricePaid = pricePaid;

//     await payment.save();

//     res.json({ message: "Payment updated successfully", payment });
//   } catch (error) {
//     console.error("Error updating payment:", error);
//     res.status(500).json({ message: "Server error updating payment" });
//   }
// };

// // Delete payment
// exports.deletePayment = async (req, res) => {
//   try {
//     const payment = await Payment.findByIdAndDelete(req.params.id);
//     if (!payment) {
//       return res.status(404).json({ message: "Payment not found" });
//     }
//     res.json({ message: "Payment deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting payment:", error);
//     res.status(500).json({ message: "Server error deleting payment" });
//   }
// };

// exports.getUsersWithPayments = async (req, res) => {
//   try {
//     const users = await User.find();

//     const userIds = users.map(user => user._id);
//     const payments = await Payment.find({ userId: { $in: userIds }, paymentStatus: "completed" });

//     const paymentMap = {};
//     payments.forEach(payment => {
//       const uid = payment.userId.toString();
//       if (!paymentMap[uid] || new Date(payment.paymentDate) > new Date(paymentMap[uid].paymentDate)) {
//         paymentMap[uid] = payment;
//       }
//     });

//     const usersWithPayments = users.map(user => ({
//       ...user.toObject(),
//       payment: paymentMap[user._id.toString()] ? {
//         pricePaid: paymentMap[user._id.toString()].pricePaid,
//         paymentMethod: paymentMap[user._id.toString()].paymentMethod,
//         paymentStatus: paymentMap[user._id.toString()].paymentStatus,
//         paymentDate: paymentMap[user._id.toString()].paymentDate,
//       } : null,
//     }));

//     res.json(usersWithPayments);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Server error fetching users with payments" });
//   }
// };

// const Payment = require("../models/payment");
// const Courses = require("../models/admin/courses");
// const Lesson = require("../models/admin/lesson");
// const User = require("../models/user"); // Make sure this path is correct

// Create payment
exports.createPayment = async (req, res) => {
  try {
    const { userId, paymentMethod, type, courseId, lessonId } = req.body;

    if (!userId || !type || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!["course", "lesson"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'course' or 'lesson'." });
    }

    // Fetch user to get username
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify course exists
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let pricePaid;

    if (type === "course") {
      // Calculate total price by summing prices of all lessons in course
      const lessons = await Lesson.find({ courseId });
      if (!lessons.length) {
        return res.status(400).json({ message: "Course has no lessons to pay for" });
      }
      pricePaid = lessons.reduce((sum, lesson) => sum + (lesson.price || 0), 0);
    } else {
      if (!lessonId) {
        return res.status(400).json({ message: "lessonId is required for lesson payment" });
      }
      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      pricePaid = lesson.price;
    }

    const payment = new Payment({
      userId,
      username: user.username, // fetched from DB for accuracy
      courseId,
      lessonId: type === "lesson" ? lessonId : null,
      pricePaid,
      paymentMethod: paymentMethod || "unknown",
      paymentStatus: "pending",
    });

    await payment.save();

    return res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all payments (with population)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate("userId", "username email")
      .populate("courseId", "title")
      .populate("lessonId", "title price")
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({ message: "Server error fetching payments" });
  }
};

// Fetch one payment by ID (with population)
exports.getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("userId", "username email")
      .populate("courseId", "title")
      .populate("lessonId", "title price");

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    res.status(500).json({ message: "Server error fetching payment" });
  }
};

// Update payment (validate paymentStatus)
exports.updatePayment = async (req, res) => {
  try {
    const { paymentStatus, paymentMethod, pricePaid } = req.body;

    const payment = await Payment.findById(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // Validate paymentStatus if provided
    const validStatuses = ["pending", "completed", "failed"];
    if (paymentStatus && !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid paymentStatus value" });
    }

    if (paymentStatus) payment.paymentStatus = paymentStatus;
    if (paymentMethod) payment.paymentMethod = paymentMethod;
    if (pricePaid !== undefined) payment.pricePaid = pricePaid;

    await payment.save();

    res.json({ message: "Payment updated successfully", payment });
  } catch (error) {
    console.error("Error updating payment:", error);
    res.status(500).json({ message: "Server error updating payment" });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Server error deleting payment" });
  }
};

// Get users with their latest completed payment info
exports.getUsersWithPayments = async (req, res) => {
  try {
    const users = await User.find();

    const userIds = users.map(user => user._id);
    const payments = await Payment.find({ userId: { $in: userIds }, paymentStatus: "completed" });

    const paymentMap = {};
    payments.forEach(payment => {
      const uid = payment.userId.toString();
      // Keep latest payment only
      if (!paymentMap[uid] || new Date(payment.paymentDate) > new Date(paymentMap[uid].paymentDate)) {
        paymentMap[uid] = payment;
      }
    });

    const usersWithPayments = users.map(user => ({
      ...user.toObject(),
      payment: paymentMap[user._id.toString()] ? {
        pricePaid: paymentMap[user._id.toString()].pricePaid,
        paymentMethod: paymentMap[user._id.toString()].paymentMethod,
        paymentStatus: paymentMap[user._id.toString()].paymentStatus,
        paymentDate: paymentMap[user._id.toString()].paymentDate,
      } : null,
    }));

    res.json(usersWithPayments);
  } catch (error) {
    console.error("Error fetching users with payments:", error);
    res.status(500).json({ message: "Server error fetching users with payments" });
  }
};
