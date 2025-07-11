
const Lesson = require("../../models/admin/lesson");

// CREATE LESSON
exports.createLesson = async (req, res) => {
  try {
    const { name, price, courseId, description, authorName, duration } =
      req.body;
    let imagepath, filepath;
    if (req.files.image) {
      imagepath = req.files.image[0].path;
    }
    if (req.files.file) {
      filepath = req.files.file[0].path;
    }
    const userId = req.user._id;

    if (!name || !price || !courseId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const lesson = new Lesson({
      name,
      price,
      courseId,
      sellerId: userId,
      filepath,
      imagepath,
      description,
      authorName,
      duration,
    });

    await lesson.save();

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

exports.getLesson = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "" } = req.query;
    const skips = (page - 1) * limit;

    const filter = search
      ? {
          name: { $regex: search, $options: "i" },
        }
      : {};

    const lessons = await Lesson.find(filter)
      .populate("courseId", "name")
      .populate("sellerId", "firstName email")
      .skip(Number(skips))
      .limit(Number(limit));

    const total = await Lesson.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Lessons fetched successfully",
      data: lessons,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
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
exports.getLessonById = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findById(id)
      .populate("courseId", "name")
      .populate("sellerId", "firstName email");

    if (!lesson) {
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

exports.deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;

    const lesson = await Lesson.findByIdAndDelete(id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

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
exports.updateLesson = async (req, res) => {
  try {
    const { id } = req.params;

    // Defensive check on req.body
    const {
      name,
      price,
      courseId,
      userId,
      description,
      authorName,
      duration
    } = req.body || {};

    // Access files from multer
    const imageFile = req.files?.image?.[0];
    const otherFile = req.files?.file?.[0];
    const filepath = otherFile?.path || req.body?.filepath;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: "Lesson not found",
      });
    }

    lesson.name = name || lesson.name;
    lesson.price = price || lesson.price;
    lesson.courseId = courseId || lesson.courseId;
    lesson.sellerId = userId || lesson.sellerId;
    lesson.filepath = filepath || lesson.filepath;
    lesson.description = description || lesson.description
    lesson.authorName = authorName || lesson.authorName;
    lesson.duration = duration || lesson.duration;

    // Optionally handle imageFile if needed
    if (imageFile) {
      lesson.imagePath = imageFile.path; // or however you store it
    }

    await lesson.save();

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
