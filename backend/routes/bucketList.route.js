import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import {
  addBucketListItem,
  deleteBucketListItem,
  getBucketList,
  updateBucketListItem,
} from "../controllers/bucketList.controller.js"

const router = express.Router()

router.post("/add", verifyToken, addBucketListItem)
router.get("/get-all", verifyToken, getBucketList)
router.put("/update/:id", verifyToken, updateBucketListItem)
router.delete("/delete/:id", verifyToken, deleteBucketListItem)

export default router
