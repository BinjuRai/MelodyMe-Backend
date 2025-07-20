const express = require("express")
const router = express.Router()
const { createUser, 
    getUsers, getOneUser, updateOne, deleteOne
} = require("../../controllers/admin/userManagement")
const multer = require("multer");
const upload = multer({ dest: 'uploads/' })


const { authenticateUser, isAdmin  } = require("../../middlewares/authorizedUser");




// router.post(
//     "/", 
//     createUser
// )
router.post("/", upload.single('image'), createUser);



router.get(
    "/",
    authenticateUser, 
    isAdmin,
    getUsers
)

router.get(
    "/:id", 
    getOneUser
)
router.put(
    "/:id",
    updateOne
)
router.delete(
    "/:id", 
    deleteOne
)
module.exports = router