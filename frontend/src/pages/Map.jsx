import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar"
import axiosInstance from "../utils/axiosInstance"
import MapView from "../components/MapView"

const Map = () => {
  const [publicStories, setPublicStories] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")

  // Get public travel stories
  const getPublicTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/travel-story/public")

      if (response.data && response.data.stories) {
        setPublicStories(response.data.stories)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // search story
  const onSearchStory = async (query) => {
    try {
      const response = await axiosInstance.get("/travel-story/search", {
        params: {
          query: query,
        },
      })

      if (response.data && response.data.stories) {
        setFilterType("search")
        setPublicStories(response.data.stories)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setFilterType("")
    getPublicTravelStories()
  }

  useEffect(() => {
    getPublicTravelStories()
  }, [])

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Travel Map</h2>
        <p className="text-gray-600 text-center mb-8">
          Explore travel destinations from stories shared by our community
        </p>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <MapView
            locations={publicStories.flatMap(story =>
              story.visitedLocation.map(location => ({
                lat: Math.random() * 180 - 90, // Random lat for demo
                lng: Math.random() * 360 - 180, // Random lng for demo
                name: location,
                description: story.title
              }))
            )}
            height="600px"
            useGoogleMaps={false}
          />
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Featured Stories</h3>
          {publicStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicStories.slice(0, 6).map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">
                    By {item.userId?.username}
                  </p>
                  <p className="text-sm text-gray-500 line-clamp-3">
                    {item.story.substring(0, 100)}...
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1">
                    {item.visitedLocation.slice(0, 3).map((location, index) => (
                      <span
                        key={index}
                        className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
                      >
                        {location}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No stories available yet. Be the first to share your travel experiences!
            </p>
          )}
        </div>
        </div>
      </div>
    </>
  )
}

export default Map
