const Wishlist = require("../models/Wishlist");
const Lesson = require("../models/admin/lesson");

// GET Wishlist
exports.getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id }).populate("lessons");

    if (!wishlist) {
      return res.status(200).json({ success: true, lessons: [] });
    }

    return res.status(200).json({ success: true, lessons: wishlist.lessons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ADD to Wishlist
exports.addToWishlist = async (req, res) => {
  const { lessonId } = req.body;

  if (!lessonId) {
    return res.status(400).json({ success: false, message: "Lesson ID required" });
  }

  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, lessons: [lessonId] });
    } else if (!wishlist.lessons.includes(lessonId)) {
      wishlist.lessons.push(lessonId);
    } else {
      return res.status(409).json({ success: false, message: "Lesson already in wishlist" });
    }

    await wishlist.save();
    const populated = await wishlist.populate("lessons");

    return res.status(200).json({ success: true, message: "Added to wishlist", lessons: populated.lessons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// REMOVE from Wishlist
exports.removeFromWishlist = async (req, res) => {
  const { lessonId } = req.params;

  if (!lessonId) {
    return res.status(400).json({ success: false, message: "Lesson ID required" });
  }

  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      return res.status(404).json({ success: false, message: "Wishlist not found" });
    }

    wishlist.lessons = wishlist.lessons.filter(
      (id) => id.toString() !== lessonId.toString()
    );

    await wishlist.save();
    const populated = await wishlist.populate("lessons");

    return res.status(200).json({ success: true, message: "Removed from wishlist", lessons: populated.lessons });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
