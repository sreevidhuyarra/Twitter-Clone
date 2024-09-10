import Notification from "../models/notification.models.js";
import Post from "../models/post.models.js";
import User from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";

export const getNotifications = async (req, res) => {
    try {
		const userId = req.user._id;

		const notifications = await Notification.find({ to: userId }).populate({
			path: "from",
			select: "username profileImg",
		});

		await Notification.updateMany({ to: userId }, { read: true });

		res.status(200).json(notifications);
	}
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteNotifications = async (req, res) => {
    try {
		const userId = req.user._id;

		await Notification.deleteMany({ to: userId });

		res.status(200).json({ message: "Notifications deleted successfully" });
	} catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}