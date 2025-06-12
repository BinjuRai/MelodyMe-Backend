const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

exports.registerUser = async (req, res) => {
     console.log(">>> registerUser called");
    const { username, email, firstName, lastName, password, phoneno } = req.body;

  
    if (!username || !email || !password || !phoneno) {
        return res.status(400).json({
            success: false,
            message: "Missing fields"
        });
    }

    try {
        const existingUser = await User.findOne({
            $or: [{ username: username }, { email: email }, { phoneno: phoneno }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User exists"
            });
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const newUser = new User({
            firstName,
            lastName,
            username,
            phoneno,
            email,
            password: hashedPass
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User Registered"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message || "Server error"
        });
    }
};


exports.loginUser = async( req , res) => {
    const {email,password} = req.body
    //validation
    if (!email || !password){
        return res.status(400).json(
            {"success":false, "message":"Missing field"}
        )
    }
    try{
        const getUser = await User.findOne(
            {email:email}
        )
        if (!getUser){
            return res.status(403).json(
                {"success":false, "message":"User not found"}
            )
        }
        const passwordCheck = await bcrypt.compare(password, getUser.password) //pass , hased password
        if(!passwordCheck){
            return res.status(403).json(
                {"success":false, "message":"Invalid credentials"}
            )
        }
        //
        const payload={
            "_id":getUser._id,
            "email":getUser.email,
            "username":getUser.username
        }
        const token = jwt.sign(payload, process.env.SECRET,
            {expiresIn:"7d"}
        )
        return res.status(200).json(
            {
                "success":true,
                "message":"Login Successful",
                "data":getUser,
                "token":token  //user token in login
            }
        )
    }catch(err){
        console.log(err)
        return res.status(500).json(
            {"success":false, "message":"Server error"}
        )
    }
}