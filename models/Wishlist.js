
const mongoose = require("mongoose")


const WishlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
});
module.exports = mongoose.model(
    "Wishlist", WishlistSchema
)