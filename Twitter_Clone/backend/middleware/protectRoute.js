import User from "../models/user.models.js";
import jwt from 'jsonwebtoken';
export const protectRoute = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(401).json({message: "Unauthorised and no token provided"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // console.log(decoded);
        if(!decoded){
            return res.status(401).json({message: "Unauthorised and invalid token provided"});
        }
        const user = await User.findById(decoded.id).select("-password");
        // console.log(user);
        req.user = user;
        next();
    }catch(error){
        console.log("Error in protectRoute");
        console.log(error);
    }
}