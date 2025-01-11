import express from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, verifyUser } from "../controllers/userAuth.js";


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.post("/refresh-token",refreshAccessToken);
router.post("/verify",verifyUser);



export default router;