const express = require("express");
const router = express.Router();

const { authenticateUser } = require("../middlewares/authorizedUser");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/userWishlistController");

// Protect all wishlist routes
router.use(authenticateUser);

// Routes
router.get("/", getWishlist); // GET /api/normal/wishlist
router.post("/", addToWishlist); // POST /api/normal/wishlist
router.delete("/:lessonId", removeFromWishlist); // DELETE /api/normal/wishlist/:lessonId

module.exports = router;

