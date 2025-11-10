import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import axiosInstance from "../utils/axiosInstance"
import { getInitials } from "../utils/helper"
import TravelStoryCard from "../components/TravelStoryCard"
import { MdEdit, MdLocationOn, MdDateRange, MdMessage } from "react-icons/md"
import moment from "moment"
import LikeButton from "../components/LikeButton"
import CommentSection from "../components/CommentSection"
import { useSelector } from "react-redux"
import Modal from "react-modal"
import ViewTravelStory from "./Home/ViewTravelStory"

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [user, setUser] = useState(null)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  })

  useEffect(() => {
    getUserProfile()
  }, [userId])

  const getUserProfile = async () => {
    try {
      const response = await axiosInstance.get(`/user/profile/${userId}`)

      if (response.data) {
        setUser(response.data.user)
        setStories(response.data.stories)
      }
    } catch (error) {
      console.log("Error fetching user profile:", error)
      navigate("/home")
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }

  const closeViewModal = () => {
    setOpenViewModal({ isShown: false, data: null })
  }

  if (loading) {
    return (
      <>
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchNote={() => {}}
          handleClearSearch={handleClearSearch}
        />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchNote={() => {}}
          handleClearSearch={handleClearSearch}
        />
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-500">User not found</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={() => {}}
        handleClearSearch={handleClearSearch}
      />

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          {/* Profile Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Picture */}
              {user.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 text-2xl md:text-3xl">
                  {getInitials(user.username)}
                </div>
              )}

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  {user.username}
                </h1>

                {user.bio && (
                  <p className="text-gray-600 mb-4 text-sm md:text-base">
                    {user.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <div className="text-xl font-bold text-cyan-600">{stories.length}</div>
                    <div className="text-sm text-gray-500">Stories</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-cyan-600">
                      {stories.filter(story => story.likes?.length || 0).reduce((acc, story) => acc + (story.likes?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-gray-500">Likes</div>
                  </div>
                </div>

                {/* Favorite Destinations */}
                {user.favoriteDestinations && user.favoriteDestinations.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Favorite Destinations</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.favoriteDestinations.map((destination, index) => (
                        <span
                          key={index}
                          className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm"
                        >
                          {destination}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Message Button */}
                {currentUser && currentUser._id !== userId && (
                  <button
                    onClick={() => navigate(`/messages/${userId}`)}
                    className="flex items-center gap-2 bg-cyan-500 text-white px-4 py-2 rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    <MdMessage size={18} />
                    Send Message
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stories Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Travel Stories</h2>

            {stories.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((story) => (
                  <div key={story._id} className="bg-white rounded-lg shadow-md p-4">
                    <TravelStoryCard
                      imageUrl={story.imageUrl}
                      title={story.title}
                      story={story.story}
                      date={story.visitedDate}
                      visitedLocation={story.visitedLocation}
                      isFavourite={story.isFavorite}
                      onClick={() => handleViewStory(story)}
                      onFavouriteClick={() => {}}
                    />

                    <div className="mt-4 flex items-center gap-4">
                      <LikeButton
                        storyId={story._id}
                        initialLikes={story.likes || []}
                        userId={currentUser?._id}
                        onLikeUpdate={(updatedLikes) => {
                          // Update the local state
                          setStories(prevStories =>
                            prevStories.map(s =>
                              s._id === story._id
                                ? { ...s, likes: updatedLikes }
                                : s
                            )
                          )
                        }}
                      />
                    </div>

                    <CommentSection
                      storyId={story._id}
                      comments={story.comments || []}
                      onCommentUpdate={(updatedComments) => {
                        // Update the local state
                        setStories(prevStories =>
                          prevStories.map(s =>
                            s._id === story._id
                              ? { ...s, comments: updatedComments }
                              : s
                          )
                        )
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No public stories yet</p>
                <p className="text-gray-400 text-sm mt-2">
                  This user hasn't shared any travel stories publicly.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Story View Modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={closeViewModal}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={closeViewModal}
          onEditClick={() => {}}
          onDeleteClick={() => {}}
        />
      </Modal>
    </>
  )
}

export default UserProfile
