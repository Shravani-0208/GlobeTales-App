import BucketList from "../models/bucketList.model.js"
import { errorHandler } from "../utils/error.js"

export const addBucketListItem = async (req, res, next) => {
  const { destination, description, targetDate, priority } = req.body
  const userId = req.user.id

  if (!destination) {
    return next(errorHandler(400, "Destination is required"))
  }

  try {
    const bucketListItem = new BucketList({
      destination,
      description: description || "",
      userId,
      targetDate: targetDate ? new Date(parseInt(targetDate)) : null,
      priority: priority || "medium",
    })

    await bucketListItem.save()

    res.status(201).json({
      item: bucketListItem,
      message: "Bucket list item added successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const getBucketList = async (req, res, next) => {
  const userId = req.user.id

  try {
    const bucketList = await BucketList.find({ userId }).sort({
      priority: -1,
      createdAt: -1,
    })

    res.status(200).json({ items: bucketList })
  } catch (error) {
    next(error)
  }
}

export const updateBucketListItem = async (req, res, next) => {
  const { id } = req.params
  const { destination, description, isCompleted, targetDate, priority } = req.body
  const userId = req.user.id

  try {
    const bucketListItem = await BucketList.findOne({ _id: id, userId })

    if (!bucketListItem) {
      return next(errorHandler(404, "Bucket list item not found"))
    }

    bucketListItem.destination = destination || bucketListItem.destination
    bucketListItem.description = description !== undefined ? description : bucketListItem.description
    bucketListItem.isCompleted = isCompleted !== undefined ? isCompleted : bucketListItem.isCompleted
    bucketListItem.targetDate = targetDate ? new Date(parseInt(targetDate)) : bucketListItem.targetDate
    bucketListItem.priority = priority || bucketListItem.priority

    await bucketListItem.save()

    res.status(200).json({
      item: bucketListItem,
      message: "Bucket list item updated successfully!",
    })
  } catch (error) {
    next(error)
  }
}

export const deleteBucketListItem = async (req, res, next) => {
  const { id } = req.params
  const userId = req.user.id

  try {
    const bucketListItem = await BucketList.findOne({ _id: id, userId })

    if (!bucketListItem) {
      return next(errorHandler(404, "Bucket list item not found"))
    }

    await BucketList.findByIdAndDelete(id)

    res.status(200).json({ message: "Bucket list item deleted successfully!" })
  } catch (error) {
    next(error)
  }
}
