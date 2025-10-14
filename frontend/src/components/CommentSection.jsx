import React, { useState } from "react"
import { FaRegComment } from "react-icons/fa"
import axiosInstance from "../utils/axiosInstance"
import { toast } from "react-toastify"

const CommentSection = ({ storyId, comments = [], onCommentUpdate }) => {
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const response = await axiosInstance.post(`/travel-story/comment/${storyId}`, {
        text: newComment.trim()
      })

      if (response.data && response.data.story) {
        if (onCommentUpdate) {
          onCommentUpdate(response.data.story.comments)
        }
        setNewComment("")
        toast.success("Comment added!")
      }
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mt-4">
      <button
        onClick={() => setShowComments(!showComments)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
      >
        <FaRegComment size={16} />
        <span className="text-sm">{comments.length} Comments</span>
      </button>

      {showComments && (
        <div className="mt-3 space-y-3">
          {/* Add Comment Form */}
          <form onSubmit={handleSubmitComment} className="flex gap-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isSubmitting}
            />
            <button
              type="submit"
              disabled={!newComment.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {comments.map((comment, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-gray-800">
                    {comment.username}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.text}</p>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default CommentSection
