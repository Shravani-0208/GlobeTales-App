import React, { useState } from "react"
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai"
import axiosInstance from "../utils/axiosInstance"

const LikeButton = ({ storyId, initialLikes = [], userId, onLikeUpdate }) => {
  const [likes, setLikes] = useState(initialLikes)
  const [isLiking, setIsLiking] = useState(false)

  const isLiked = likes.includes(userId)

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      const response = await axiosInstance.put(`/travel-story/like/${storyId}`)

      if (response.data && response.data.story) {
        setLikes(response.data.story.likes)
        if (onLikeUpdate) {
          onLikeUpdate(response.data.story.likes)
        }
      }
    } catch (error) {
      console.error("Error liking story:", error)
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={isLiking}
      className={`flex items-center gap-1 px-3 py-1 rounded-full transition-colors ${
        isLiked
          ? "bg-red-100 text-red-600 hover:bg-red-200"
          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      } ${isLiking ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {isLiked ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
      <span className="text-sm">{likes.length}</span>
    </button>
  )
}

export default LikeButton
