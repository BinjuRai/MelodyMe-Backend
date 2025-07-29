const express = require("express")
const router = express.Router()
const { authenticateUser } = require("../middlewares/authorizedUser");

const { registerUser, loginUser, sendResetLink, resetPassword } = require("../controllers/userController") 

const { getProfile, updateProfile, changePassword } = require("../controllers/userController");

router.post(
    "/register",
    registerUser
)
router.post(
    "/login",
    loginUser
) 
router.post("/request-reset", sendResetLink)
router.post("/reset-password/:token", resetPassword)

router.get("/profile", authenticateUser, getProfile);         // 🔐 Authenticated users only
router.put("/profile", authenticateUser, updateProfile);      // 🔐 Authenticated users only
router.put("/change-password", authenticateUser, changePassword);

module.exports = router