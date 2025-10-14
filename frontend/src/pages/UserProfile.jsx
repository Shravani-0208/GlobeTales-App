import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import axiosInstance from "../utils/axiosInstance"
import { getInitials } from "../utils/helper"
import TravelStoryCard from "../components/TravelStoryCard"
import { MdEdit, MdLocationOn, MdDateRange } from "react-icons/md"
import moment from "moment"

const UserProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

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

      <div className="container mx-auto py-8 px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Picture */}
            <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 text-2xl md:text-3xl">
              {getInitials(user.username)}
            </div>

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
            </div>
          </div>
        </div>

        {/* Stories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Travel Stories</h2>

          {stories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <TravelStoryCard
                  key={story._id}
                  story={story}
                  onClick={() => navigate(`/home?story=${story._id}`)}
                  onFavoriteClick={() => {}}
                  isFavorite={false}
                />
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
    </>
  )
}

export default UserProfile
