import User from "../models/user.model.js"
import TravelStory from "../models/travelStory.model.js"
import { errorHandler } from "../utils/error.js"

export const getUsers = async (req, res, next) => {
  const userId = req.user.id

  const validUser = await User.findOne({ _id: userId })

  if (!validUser) {
    return next(errorHandler(401, "Unauthorized"))
  }

  const { password: pass, ...rest } = validUser._doc

  res.status(200).json(rest)
}

export const updateUserProfile = async (req, res, next) => {
  const userId = req.user.id
  const { bio, favoriteDestinations, profilePicture } = req.body

  try {
    const user = await User.findById(userId)

    if (!user) {
      return next(errorHandler(404, "User not found"))
    }

    user.bio = bio !== undefined ? bio : user.bio
    user.favoriteDestinations = favoriteDestinations !== undefined ? favoriteDestinations : user.favoriteDestinations
    user.profilePicture = profilePicture !== undefined ? profilePicture : user.profilePicture

    await user.save()

    const { password: pass, ...userData } = user._doc

    res.status(200).json({
      user: userData,
      message: "Profile updated successfully!"
    })
  } catch (error) {
    next(error)
  }
}

export const getUserProfile = async (req, res, next) => {
  const { userId } = req.params

  try {
    const user = await User.findById(userId).select('-password')

    if (!user) {
      return next(errorHandler(404, "User not found"))
    }

    // Get user's public stories
    const stories = await TravelStory.find({
      userId: userId,
      isPublic: true
    }).sort({ createdAt: -1 })

    res.status(200).json({
      user,
      stories
    })
  } catch (error) {
    next(error)
  }
}

export const signout = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json("User has been loggedout successfully!")
  } catch (error) {
    next(error)
  }
}

export const searchUsers = async (req, res, next) => {
  const { query } = req.query

  if (!query || query.trim() === "") {
    return next(errorHandler(400, "Search query is required"))
  }

  try {
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(20)

    res.status(200).json({
      users,
      message: "Users found successfully"
    })
  } catch (error) {
    next(error)
  }
}
