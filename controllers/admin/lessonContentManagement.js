const mongoose = require("mongoose");
const Lesson = require("../../models/admin/lesson");
const Course = require("../../models/admin/courses");
const Notification = require("../../models/notification");
const updateCourseTotalPrice = require('../../services/updateCourseTotalPrice');


exports.createLesson = async (req, res) => {
  try {
    const { name, price, courseId, description, authorName, duration } = req.body;
    const userId = req.user._id;

    if (!name || !price || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: name, price, courseId are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid course ID format",
      });
    }

    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let imagepath, filepath;
    if (req.files?.image?.[0]) {
      imagepath = req.files.image[0].path;
    }
    if (req.files?.file?.[0]) {
      filepath = req.files.file[0].path;
    }

    const sanitizedPrice = parseFloat(price.toString().replace(/[^\d.]/g, ''));

    const lesson = new Lesson({
      name,
      price: sanitizedPrice,
      courseId,
      sellerId: userId,
      filepath,
      imagepath,
      description,
      authorName,
      duration,
    });
    if (!lesson.courseId) {
  return res.status(400).json({
    success: false,
    message: "courseId is required and must be valid",
  });
    }

    await lesson.save();

    await updateCourseTotalPrice(courseId);

    // ✅ Notify users
    await notifyUsersAboutLesson(lesson, req.app);

    return res.status(201).json({
      success: true,
      message: "New lesson created successfully",
      data: lesson,
    });

  } catch (error) {
    console.error("Error creating lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating lesson",
    });
  }
};

// ✅ Notification function inside the same file
async function notifyUsersAboutLesson(lesson, app) {
  try {
    const users = await User.find({ enrolledCourses: lesson.courseId });

    const io = app.get("io");
    const connectedUsers = app.get("connectedUsers");

    for (const user of users) {
      const message = `New lesson "${lesson.name}" added to your course.`;

      const notification = new Notification({
        userId: user._id,
        message,
        courseId: lesson.courseId,
        lessonId: lesson._id,
      });

      await notification.save();

      const socketId = connectedUsers.get(user._id.toString());
      if (socketId) {
        io.to(socketId).emit("newNotification", {
          message,
          courseId: lesson.courseId,
          lessonId: lesson._id,
          createdAt: notification.createdAt,
        });
      }
    }
  } catch (error) {
    console.error("Error notifying users:", error);
  }
}


/**
 * Get lessons with pagination and search
 */
exports.getLesson = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const search = req.query.search?.trim() || "";
    const skip = (page - 1) * limit;

    // Build search filter
    const filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { authorName: { $regex: search, $options: "i" } },
      ];
    }

    // Fetch lessons with pagination and total count in parallel
    const [lessons, total] = await Promise.all([
      Lesson.find(filter)
        .populate("courseId", "name")
        .populate("sellerId", "firstName email")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Lesson.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(total / limit);
    console.log("lesson ready to return")
    return res.status(200).json({
      success: true,
      message: "Lessons fetched successfully",
      data: lessons,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching lessons",
    });
  }
};


/**
 * Get lesson by ID
 */
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;
     console.log("Received request for lesson ID:", id);
    // Validate lesson ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid lesson ID format:", id);
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID format",
      });
    }

    const lesson = await Lesson.findById(id)
      .populate("courseId", "name")
      .populate("sellerId", "firstName email");

    if (!lesson) {
       console.log("Lesson not found in DB for ID:", id);
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lesson fetched successfully",
      data: lesson,
    });
  } catch (error) {
    console.error("Error fetching lesson by ID:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching lesson",
    });
  }
};




/**
 * Update lesson
 */
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      courseId,
      description,
      authorName,
      duration,
    } = req.body;

    // Validate lesson ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID format",
      });
    }

    // Find existing lesson
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    const oldCourseId = lesson.courseId.toString();

    // Validate new courseId if changed
    if (courseId && courseId !== oldCourseId) {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid course ID format",
        });
      }

      const courseExists = await Course.findById(courseId);
      if (!courseExists) {
        return res.status(404).json({
          success: false,
          message: "Course not found",
        });
      }
    }

    // Handle file uploads
    const imageFile = req.files?.image?.[0];
    const otherFile = req.files?.file?.[0];
    const filepath = otherFile?.path || lesson.filepath; // fallback to old filepath

    // Update fields if provided
    if (name !== undefined) lesson.name = name;

    if (price !== undefined) {
      const sanitizedPrice = parseFloat(price.toString().replace(/[^\d.]/g, ''));
      lesson.price = sanitizedPrice;
    }

    if (courseId !== undefined) lesson.courseId = courseId;
    
    // Always use the authenticated user as seller
    lesson.sellerId = req.user._id;

    lesson.filepath = filepath;

    if (description !== undefined) lesson.description = description;
    if (authorName !== undefined) lesson.authorName = authorName;
    if (duration !== undefined) lesson.duration = duration;

    if (imageFile) {
      lesson.imagepath = imageFile.path;
    }

    await lesson.save();

    // Update total prices of old and new courses if course changed
    const coursesToUpdate = [lesson.courseId.toString()];
    if (courseId && courseId !== oldCourseId) {
      coursesToUpdate.push(oldCourseId);
    }

    await Promise.all(coursesToUpdate.map(cId => updateCourseTotalPrice(cId)));

    return res.status(200).json({
      success: true,
      message: "Lesson updated successfully",
      data: lesson,
    });
  } catch (error) {
    console.error("Error updating lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while updating lesson",
    });
  }
};

/**
 * Delete lesson
 */
exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate lesson ID format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lesson ID format",
      });
    }

    // Delete lesson document
    const lesson = await Lesson.findByIdAndDelete(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    // Update course total price after deletion
    await updateCourseTotalPrice(lesson.courseId);

    return res.status(200).json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting lesson:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while deleting lesson",
    });
  }
};

