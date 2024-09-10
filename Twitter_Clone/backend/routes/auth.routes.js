import express from "express";
import { signup , signout, login, getMe} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";
const router = express.Router();

router.get("/me",protectRoute,getMe);
router.post("/signup",signup);
router.post("/signout",signout);
router.post("/login",login);

export default router;