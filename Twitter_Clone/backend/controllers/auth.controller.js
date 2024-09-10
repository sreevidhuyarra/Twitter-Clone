import User from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
export const signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        console.log(req.body);
        // if(!emailRegex.test(email)){
        //     return res.status(400).json({message: "Invalid email"});
        // }
        var existing = await User.findOne({username});
        if(existing){
            return res.status(400).json({message: "username already exists"});
        }
        existing  = await User.findOne({email});
        if(existing){
            return res.status(400).json({message: "email already exists"});
        }
        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
            username,
            email,
            password: hashedPassword,
        });
        if(user){
            generateTokenAndSetCookie(user._id, res);
            await user.save();
            res.status(201).json({message: "User created successfully   "});
        }
        else{
            res.status(400).json({message: "Something went wrong in signup"});
        }
    } catch (error) {
        console.log(error);
    }
};
export const signout = async (req, res) => {
    try{
        res.cookie("jwt", "", {maxAge: 0});
        res.status(200).json({message: "User signed out successfully"});
    }
    catch(error){
        console.log("Error in logout");
        console.log(error);
    }
}
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user  = await User.findOne({username});
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "");
        if(!user || !isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }
        generateTokenAndSetCookie(user._id, res);
        res.status(200).json({message: "User logged in successfully"});
    } catch(error){
        console.log(error);
    }
} 

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
    }
}
