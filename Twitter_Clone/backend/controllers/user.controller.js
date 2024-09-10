import User from "../models/user.models.js";
import Notification from "../models/notification.models.js";
import {v2 as cloudinary} from "cloudinary";

export const getUserProfile = async (req, res) => {
    // console.log("HI");
    const {username} = req.params;
    // console.log(username);
    try{
        const user = await User.findOne({username}).select("-password");
        // console.log(user);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({user});
    }catch(error){
        console.log("Error in getUserProfile");
        console.log(error);
    }
}

export const followUnfollowUser = async (req, res) => {
    try{
        const {id} = req.params;
        console.log(id);
        const userToModify = await User.findById(id);
        const currentUser  = await User.findById(req.user.id);
        if(id === req.user.id.toString()){
            return res.status(400).json({message: "You cannot follow yourself"});
        }
        if(!userToModify || !currentUser){
            return res.status(404).json({message: "User not found"});
        }
        const isFollowing = currentUser.following.includes(id);
        if(isFollowing){
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user.id}});
            await User.findByIdAndUpdate(req.user.id, {$pull: {following: id}});
            res.status(200).json({message: "Operation successful"});
        }else{
            await User.findByIdAndUpdate(id, {$push: {followers: req.user.id}});
            await User.findByIdAndUpdate(req.user.id, {$push: {following: id}});
            
            const newNotification = new Notification({
                type: "follow",
                from: req.user.id,
                to: id,
            })
            await newNotification.save();
            // return id of user as response
            res.status(200).json({message: "Operation successful"});
            
        }
    }catch(error){
        console.log("Error in followUnfollowUser");
        console.log(error);
    }
}
export const getSuggestedProfiles = async (req, res) => {
    try{
        const userId = req.user._id;
        const usersfollowedbyme = await User.findById(userId).select("following");
        const users = await User.aggregate([
            {$match: {_id: {$ne: userId}}},
            {$sample: {size: 5}},
        ]);
        console.log(users);
        const filteredUsers = users.filter(user => !usersfollowedbyme.following.includes(user.id));
        const suggestedUsers = filteredUsers.slice(0 , 4);
        suggestedUsers.forEach((user) => (user.password = null));
        res.status(200).json(suggestedUsers);
    }catch(error){
        console.log("Error in getSuggestedProfiles");
        console.log(error);
    }
}
export const updateUserProfile = async (req, res) => {
    try{
        const {email, username , newPassword,currentPassword,bio, link} = req.body;
        console.log(email);
        let {profileImage, coverImg} = req.body;
        const userId = req.user._id;
        console.log(userId);
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({message: "User not found"});
        }
        if((!newPassword && currentPassword) || (newPassword && !currentPassword)){
            return res.status(400).json({message: "Please enter both new and old password"});
        }
        if(currentPassword && newPassword){
            const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
            if(!isPasswordCorrect){
                return res.status(400).json({message: "Incorrect old password"});
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
        }
        if(profileImage){
            const uploadedResponse = await cloudinary.uploader.upload(profileImage)
            profileImage = uploadedResponse.secure_url;
        }

        if(coverImg){
            const uploadedResponse = await cloudinary.uploader.upload(coverImg)
            profileImage = uploadedResponse.secure_url;
        }
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;
        user.profileImage = profileImage || user.profileImage;
        user.coverImg = coverImg || user.coverImg;
        
        user = await user.save();
        user.password = null;
        res.status(200).json(user);
        
    }catch(error){
        console.log(error);
    }
}