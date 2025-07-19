const Payment = require("../models/payment"); // Adjust path if needed
const Courses = require("../models/admin/courses");
const Lesson = require("../models/admin/lesson");

exports.createPayment = async (req, res) => {
  try {
    const {
      userId,
      paymentMethod,
      type,        // "course" or "lesson"
      courseId,
      lessonId,    // optional if type === "course"
    } = req.body;

    if (!userId || !type || !courseId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate 'type'
    if (!["course", "lesson"].includes(type)) {
      return res.status(400).json({ message: "Invalid type. Must be 'course' or 'lesson'." });
    }

    // Fetch course (to get price)
    const course = await Courses.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let pricePaid;
    if (type === "course") {
      // Full course payment
      pricePaid = course.totalPrice;
    } else if (type === "lesson") {
      if (!lessonId) {
        return res.status(400).json({ message: "lessonId is required for lesson payment" });
      }

      const lesson = await Lesson.findById(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      pricePaid = lesson.price;
    }

    // Create payment
    const payment = new Payment({
      userId,
      courseId,
      lessonId: type === "lesson" ? lessonId : null,
      pricePaid,
      paymentMethod: paymentMethod || "unknown",
      paymentStatus: "completed", // or "pending" if you want to handle async payments
    });

    await payment.save();

    return res.status(201).json({ message: "Payment recorded successfully", payment });
  } catch (error) {
    console.error("Error creating payment:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
exports.getUsersWithPayments = async (req, res) => {
  try {
    const users = await User.find();

    const userIds = users.map(user => user._id);
    const payments = await Payment.find({ userId: { $in: userIds }, paymentStatus: "completed" });

    const paymentMap = {};
    payments.forEach(payment => {
      const uid = payment.userId.toString();
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
    console.error(error);
    res.status(500).json({ message: "Server error fetching users with payments" });
  }
};