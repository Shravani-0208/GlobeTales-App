import React, { useState } from "react"
import { IoMdClose } from "react-icons/io"
import { MdOutlineDelete, MdOutlineUpdate } from "react-icons/md"
import moment from "moment"
import { FaLocationDot } from "react-icons/fa6"
import LikeButton from "../../components/LikeButton"
import CommentSection from "../../components/CommentSection"
import { useSelector } from "react-redux"

const ViewTravelStory = ({
  storyInfo,
  onClose,
  onEditClick,
  onDeleteClick,
}) => {
  const { currentUser } = useSelector((state) => state.user)
  const [likes, setLikes] = useState(storyInfo?.likes || [])
  const [comments, setComments] = useState(storyInfo?.comments || [])

  const handleLikeUpdate = (updatedLikes) => {
    setLikes(updatedLikes)
  }

  const handleCommentUpdate = (updatedComments) => {
    setComments(updatedComments)
  }

  return (
    <div className="relative">
      <div className="flex items-center justify-end">
        <div>
          <div className="flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg">
            <button className="btn-small" onClick={onEditClick}>
              <MdOutlineUpdate className="text-lg" /> UPDATE STORY
            </button>

            <button className="btn-small btn-delete" onClick={onDeleteClick}>
              <MdOutlineDelete className="text-lg" /> DELETE STORY
            </button>

            <button className="cursor-pointer" onClick={onClose}>
              <IoMdClose className="text-lg text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      <div>
        <div className="flex-1 flex flex-col gap-2 py-4">
          <h1 className="text-2xl text-slate-950">
            {storyInfo && storyInfo.title}
          </h1>

          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              {storyInfo && moment(storyInfo.visitedDate).format("Do MMM YYYY")}
            </span>

            <div className="inline-flex items-center gap-2 text-[13px] text-cyan-600 bg-cyan-200/40 rounded-sm px-2 py-1">
              <FaLocationDot className="text-sm" />

              {storyInfo &&
                storyInfo.visitedLocation.map((item, index) =>
                  storyInfo.visitedLocation.length === index + 1
                    ? `${item}`
                    : `${item},`
                )}
            </div>
          </div>
        </div>

        <img
          src={storyInfo && storyInfo.imageUrl}
          alt="story image"
          className="w-full h-[300px] object-cover rounded-lg"
        />

        <div className="mt-4">
          <p className="text-sm text-slate-950 leading-6 text-justify whitespace-pre-line">
            {storyInfo.story}
          </p>
        </div>

        {/* Like and Comment Section */}
        <div className="mt-6 border-t pt-4">
          <div className="flex items-center gap-4 mb-4">
            <LikeButton
              storyId={storyInfo?._id}
              initialLikes={likes}
              userId={currentUser?._id}
              onLikeUpdate={handleLikeUpdate}
            />
          </div>

          <CommentSection
            storyId={storyInfo?._id}
            comments={comments}
            onCommentUpdate={handleCommentUpdate}
          />
        </div>
      </div>
    </div>
  )
}

export default ViewTravelStory
