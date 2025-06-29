const User = require("../../models/User")
const bcrypt = require("bcrypt")


exports.createUser = async (req, res) => {
    const { username, email, firstName, lastName, password } = req.body
    
    if (!username || !email || !password) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Missing fields"
            }
        )
    }
   
    try {
        const existingUser = await User.findOne(
            {
                $or: [{ "username": username },
                { "email": email }]
            }
        )
        if (existingUser) {
            return res.status(400).json(
                {
                    "success": false,
                    "message": "User exists"
                }
            )
        }
        
        const hasedPas = await bcrypt.hash(
            password, 10
        ) 
        const newUser = new User({
            username,
            email,
            firstName,
            lastName,
            password: hasedPas
        })
        await newUser.save()
        return res.status(201).json(
            {
                "success": true,
                "message": "User Registered"
            }
        )
    } catch (err) {
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}


exports.getUsers = async (req, res ) => {
    try{
        const users = await User.find();
        return res.status(200).json(
            {
                "success": true,
                "message": "All users",
                "data":users
            }
        )
    }catch(err){
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}

exports.getOneUser = async (req, res) => {
    try{
        // unique identifier
        const id = req.params.id // mongodb id
        const user = await User.findOne(
            {
                "_id": id
            }
        )
        return res.status(200).json(
            {
                "succes": true,
                "message": "One user fetched",
                "data": user
            }
        )
    }catch(err){
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}


exports.updateOne = async (req, res) => {
    const { username, firstName, lastName } = req.body
    const _id = req.params.id // mongodb id
    try{
        const user = await User.updateOne(
            {
                "_id": _id
            },
            {
                $set : {
                    "username" : username,
                    "firstName": firstName,
                    "lastName": lastName
                }
            }
        )
        return res.status(200).json(
            { "success": true, "message": "User updated"}
        )
    }catch(err){
        return res.status(500).json(
            { "success": false, "message": "Server error" }
        )
    }
}


exports.deleteOne = async (req, res) => {
    const _id = req.params.id
    try{
        const user = await User.deleteOne(
            {
                "_id": _id
            }
        )
        return res.status(200).json(
            {"success" : true, "message": "User Deleted"}
        )
    }catch(err){
        return res.status(500).json(
            {"success": false, "message": "Server Error"}
        )
    }
}