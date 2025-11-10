import Message from "../models/message.model.js"
import { errorHandler } from "../utils/error.js"

export const sendMessage = async (req, res, next) => {
  const { receiverId, content } = req.body
  const senderId = req.user.id

  if (!receiverId || !content) {
    return next(errorHandler(400, "Receiver and content are required"))
  }

  try {
    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
    })

    await message.save()

    res.status(201).json({
      message: "Message sent successfully!",
      data: message,
    })
  } catch (error) {
    next(error)
  }
}

export const getMessages = async (req, res, next) => {
  const { userId } = req.params
  const currentUserId = req.user.id

  try {
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId },
      ],
    })
      .populate("sender", "username profilePicture")
      .populate("receiver", "username profilePicture")
      .sort({ createdAt: 1 })

    res.status(200).json({
      messages,
    })
  } catch (error) {
    next(error)
  }
}

export const getConversations = async (req, res, next) => {
  const currentUserId = req.user.id

  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: currentUserId }, { receiver: currentUserId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", currentUserId] },
              then: "$receiver",
              else: "$sender",
            },
          },
          lastMessage: { $first: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          _id: 0,
          user: {
            _id: "$user._id",
            username: "$user.username",
            profilePicture: "$user.profilePicture",
          },
          lastMessage: {
            _id: "$lastMessage._id",
            content: "$lastMessage.content",
            createdAt: "$lastMessage.createdAt",
            isRead: "$lastMessage.isRead",
          },
        },
      },
    ])

    res.status(200).json({
      conversations,
    })
  } catch (error) {
    next(error)
  }
}

export const markAsRead = async (req, res, next) => {
  const { userId } = req.params
  const currentUserId = req.user.id

  try {
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, isRead: false },
      { isRead: true }
    )

    res.status(200).json({
      message: "Messages marked as read",
    })
  } catch (error) {
    next(error)
  }
}
