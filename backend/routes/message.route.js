import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {
  sendMessage,
  getMessages,
  getConversations,
  markAsRead,
} from "../controllers/message.controller.js"

const router = express.Router()

router.post("/send", verifyToken, sendMessage)
router.get("/conversations", verifyToken, getConversations)
router.get("/:userId", verifyToken, getMessages)
router.put("/read/:userId", verifyToken, markAsRead)

export default router
