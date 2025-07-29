

const Payment = require("../models/payment"); // Adjust path if needed
const Courses = require("../models/admin/courses");
const Lesson = require("../models/admin/lesson");
const User = require("../models/User");



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

// Get payments by user ID
exports.getPaymentsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const payments = await Payment.find({ userId })
      .populate("courseId", "title")
      .populate("lessonId", "title price")
      .sort({ createdAt: -1 });

    if (!payments.length) {
      return res.status(404).json({ message: "No payments found for this user" });
    }

    res.json({ userId, totalPayments: payments.length, payments });
  } catch (error) {
    console.error("Error fetching user payments:", error);
    res.status(500).json({ message: "Server error fetching user payments" });
  }
};


// Get completed payments (courses or lessons) for a user
// exports.getCompletedPaymentsForUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({ message: "User ID is required" });
//     }

//     const completedPayments = await Payment.find({
//       userId,
//       paymentStatus: "completed",
//     })
//       .populate("courseId", "title description thumbnail")
//       .populate("lessonId", "title price");

//     const paidCourses = completedPayments
//       .filter(payment => payment.courseId && !payment.lessonId)
//       .map(payment => payment.courseId);

//     const paidLessons = completedPayments
//       .filter(payment => payment.lessonId)
//       .map(payment => ({
//         course: payment.courseId,
//         lesson: payment.lessonId,
//       }));

//     res.json({
//       userId,
//       courses: paidCourses,
//       lessons: paidLessons,
//     });
//   } catch (error) {
//     console.error("Error fetching completed payments:", error);
//     res.status(500).json({ message: "Server error fetching completed payments" });
//   }
// };

exports.getCompletedPaymentsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const completedPayments = await Payment.find({
      userId,
      paymentStatus: "completed",
    })
      .populate("courseId", "name filepath")
      .populate("lessonId", "name imagepath autherName");

    // Extract paid courses (no lessonId)
    const uniqueCoursesMap = new Map();
    completedPayments.forEach(payment => {
      if (payment.courseId && !payment.lessonId) {
        const course = payment.courseId;
        uniqueCoursesMap.set(course._id.toString(), {
          _id: course._id,
          name: course.name|| "Untitled name", // frontend expects `name`
          price: course.totalPrice || 0,
          filepath: course.filepath || "",
        });
      }
    });

    // Extract paid lessons (with lessonId)
    const paidLessons = completedPayments
      .filter(payment => payment.lessonId)
      .map(payment => ({
        course: payment.courseId ? {
          _id: payment.courseId._id,
          name: payment.courseId.name|| "Untitled name",
          filepath: payment.courseId.filepath || "",
          price: payment.courseId.price || 0,
        } : null,
        lesson: {
          _id: payment.lessonId._id,
          title: payment.lessonId.name || "Untitled name",
          imagepath: payment.lessonId.imagepath || "",
          authorName: payment.lessonId.authorName || "Unknown Author",
          price: payment.lessonId.price || 0,
        },
      }));

    res.json({
      userId,
      courses: Array.from(uniqueCoursesMap.values()),
      lessons: paidLessons,
    });
  } catch (error) {
    console.error("Error fetching completed payments:", error);
    res.status(500).json({ message: "Server error fetching completed payments" });
  }
};


//userside

// exports.getPaymentSummary = async (req, res) => {
//   try {
//     const summary = await Payment.aggregate([
//       { $match: { paymentStatus: "completed" } },
//       {
//         $group: {
//           _id: null,
//           totalPayments: { $sum: 1 },
//           totalAmount: { $sum: "$pricePaid" } // FIXED
//         }
//       }
//     ]);

//     res.json(summary[0] || { totalPayments: 0, totalAmount: 0 });
//   } catch (error) {
//     res.status(500).json({ message: "Server error fetching payment summary" });
//   }
// };
