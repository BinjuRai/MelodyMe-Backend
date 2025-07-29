const jwt =require("jsonwebtoken")
const User = require("../models/User")

exports.authenticateUser = async (req , res, next ) => {
    try {
        const authHeader = req.headers.authorization 
        if(!authHeader){
            return res.status(403).json(
                {"success":false, "message":"Token required"}
            )
        }
        const token = authHeader.split(" ")[1]; 
        const decoded = jwt.verify(token, process.env.SECRET) 
        const userId =decoded._id 
        const user = await User.findOne({_id:userId})
        if (!user){
            return res.status(401).json(
                {"success":false, "message":"user not found"}
            )
        }
        req.user =user 
        next()
    }catch(err){
        console.log(err)
        return res.status(500).json(
            {"success":false, "message":"Authentication error"}
        )
    }
}
exports.authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log("Authorization header:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(403).json({ success: false, message: "Token required" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Authentication error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

exports.isAdmin =(req , res , next ) => {
    if(req.user && req.user.role === 'admin'){
        next()
    } else {
        return res.status(403).json(
            {"success":false, "message":"Access denied, not admin"}
        )
    }
}
// // const jwt = require("jsonwebtoken");
// // const User = require("../models/User");

// // exports.authenticateUser = async (req, res, next) => {
// //   try {
// //     const authHeader = req.headers.authorization;
// //     if (!authHeader || !authHeader.startsWith("Bearer ")) {
// //       return res.status(403).json({ success: false, message: "Token required" });
// //     }

// //     const token = authHeader.split(" ")[1];
// //     const decoded = jwt.verify(token, process.env.SECRET);

// //     const user = await User.findById(decoded._id).select("-password"); // optional: exclude password
// //     if (!user) {
// //       return res.status(401).json({ success: false, message: "User not found" });
// //     }

// //     req.user = user;
// //     next();
// //   } catch (err) {
// //     console.error("Authentication error:", err);
// //     return res.status(401).json({ success: false, message: "Invalid or expired token" });
// //   }
// // };

// // exports.isAdmin = (req, res, next) => {
// //   if (req.user && req.user.role === "admin") {
// //     next();
// //   } else {
// //     return res.status(403).json({ success: false, message: "Access denied, not admin" });
// //   }
// // };


