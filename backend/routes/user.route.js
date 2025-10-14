import express from "express"
import { getUsers, getUserProfile, signout, updateUserProfile, searchUsers } from "../controllers/user.controller.js"
import { verifyToken } from "../utils/verifyUser.js"

const router = express.Router()

router.get("/get-user", verifyToken, getUsers)

router.put("/update-profile", verifyToken, updateUserProfile)

router.get("/profile/:userId", getUserProfile)

router.post("/signout", verifyToken, signout)

router.get("/search", verifyToken, searchUsers)

export default router
