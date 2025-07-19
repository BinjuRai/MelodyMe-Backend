const mongoose = require("mongoose");

const CoursesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  totalPrice: {
    type: Number,
    default: 0, // Initially zero
  },
  filepath: {
    type: String,
  },
});
module.exports = mongoose.model("Courses", CoursesSchema);
