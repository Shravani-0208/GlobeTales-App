import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import Navbar from "../../components/Navbar"
import axiosInstance from "../../utils/axiosInstance"
import TravelStoryCard from "../../components/TravelStoryCard"
import { ToastContainer, toast } from "react-toastify"
import { IoMdAdd } from "react-icons/io"
import Modal from "react-modal"
import AddEditTravelStory from "../../components/AddEditTravelStory"
import ViewTravelStory from "./ViewTravelStory"
import EmptyCard from "../../components/EmptyCard"
import { DayPicker } from "react-day-picker"
import moment from "moment"
import FilterInfoTitle from "../../components/FilterInfoTitle"
import { getEmptyCardMessage } from "../../utils/helper"
import LikeButton from "../../components/LikeButton"
import CommentSection from "../../components/CommentSection"
import MapView from "../../components/MapView"

const Home = () => {
  const [allStories, setAllStories] = useState([])
  const [publicStories, setPublicStories] = useState([])
  const [viewMode, setViewMode] = useState("my") // "my" or "public"

  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("")

  const [dateRange, setDateRange] = useState({ from: null, to: null })

  // console.log(allStories)

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  })

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  })

  // Get all travel stories
  const getAllTravelStories = async () => {
    try {
      const response = await axiosInstance.get("/travel-story/get-all")

      if (response.data && response.data.stories) {
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

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

  // Handle Edit Story
  const handleEdit = async (data) => {
    setOpenAddEditModal({ isShown: true, type: "edit", data: data })
  }

  const handleViewStory = (data) => {
    setOpenViewModal({ isShown: true, data })
  }

  const updateIsFavourite = async (storyData) => {
    const storyId = storyData._id

    try {
      const response = await axiosInstance.put(
        "/travel-story/update-is-favourite/" + storyId,
        {
          isFavorite: !storyData.isFavorite,
        }
      )

      if (response.data && response.data.story) {
        toast.success("Story updated successfully!")
        getAllTravelStories()
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id

    try {
      const response = await axiosInstance.delete(
        "/travel-story/delete-story/" + storyId
      )

      if (response.data && !response.data.error) {
        toast.success("Story deleted successfully!")

        setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))

        getAllTravelStories()
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
        setAllStories(response.data.stories)
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setFilterType("")
    getAllTravelStories()
  }

  // Handle filter travel story by date range
  const filterStoriesByDate = async (day) => {
    try {
      const startDate = day.from ? moment(day.from).valueOf() : null
      const endDate = day.to ? moment(day.to).valueOf() : null

      if (startDate && endDate) {
        const response = await axiosInstance.get("/travel-story/filter", {
          params: { startDate, endDate },
        })

        if (response.data && response.data.stories) {
          setFilterType("date")
          setAllStories(response.data.stories)
        }
      }
    } catch (error) {
      console.log("Something went wrong. Please try again.")
    }
  }

  // Handle date range click
  const handleDayClick = (day) => {
    setDateRange(day)
    filterStoriesByDate(day)
  }

  const resetFilter = () => {
    setDateRange({ from: null, to: null })
    setFilterType("")
    getAllTravelStories()
  }

  useEffect(() => {
    getAllTravelStories()
    getPublicTravelStories()

    return () => {}
  }, [])

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={onSearchStory}
        handleClearSearch={handleClearSearch}
      />

      <div className="container mx-auto py-10">
        {/* View Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setViewMode("my")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                viewMode === "my"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              My Stories
            </button>
            <button
              onClick={() => setViewMode("public")}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                viewMode === "public"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Public Feed
            </button>
          </div>
        </div>

        {viewMode === "my" ? (
          <>
            <FilterInfoTitle
              filterType={filterType}
              filterDate={dateRange}
              onClear={() => {
                resetFilter()
              }}
            />

            <div className="flex gap-7">
              <div className="flex-1">
                {allStories.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4">
                    {allStories.map((item) => {
                      return (
                        <TravelStoryCard
                          key={item._id}
                          imageUrl={item.imageUrl}
                          title={item.title}
                          story={item.story}
                          date={item.visitedDate}
                          visitedLocation={item.visitedLocation}
                          isFavourite={item.isFavorite}
                          onEdit={() => handleEdit(item)}
                          onClick={() => handleViewStory(item)}
                          onFavouriteClick={() => updateIsFavourite(item)}
                        />
                      )
                    })}
                  </div>
                ) : (
                  <EmptyCard
                    imgSrc={
                      "https://images.pexels.com/photos/5706021/pexels-photo-5706021.jpeg?auto=compress&cs=tinysrgb&w=600"
                    }
                    message={getEmptyCardMessage(filterType)}
                    setOpenAddEditModal={() =>
                      setOpenAddEditModal({
                        isShown: true,
                        type: "add",
                        data: null,
                      })
                    }
                  />
                )}
              </div>

              <div className="w-[320px]">
                <div className="bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg">
                  <div className="p-3">
                    <DayPicker
                      captionLayout="dropdown"
                      mode="range"
                      selected={dateRange}
                      onSelect={handleDayClick}
                      pagedNavigation
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Public Travel Stories</h2>

            {/* User Profiles Section */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Discover Other Travelers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicStories.slice(0, 6).map((story) => {
                  const user = story.userId;
                  return (
                    <div key={user?._id || story._id} className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <img
                          src={user?.profilePicture || "https://via.placeholder.com/50"}
                          alt={user?.username}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-800">{user?.username}</h4>
                          <p className="text-sm text-gray-500">
                            {story.visitedLocation?.length > 0 ? story.visitedLocation[0] : 'Traveler'}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {story.story?.substring(0, 100)}...
                      </p>
                      <button
                        onClick={() => handleViewStory(story)}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
                      >
                        View Profile
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {publicStories.length > 0 ? (
              <div className="space-y-6">
                {publicStories.map((item) => {
                  return (
                    <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={item.userId?.profilePicture || "https://via.placeholder.com/40"}
                            alt={item.userId?.username}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-800">{item.userId?.username}</h3>
                            <p className="text-sm text-gray-500">
                              {moment(item.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>
                      </div>

                      <TravelStoryCard
                        imageUrl={item.imageUrl}
                        title={item.title}
                        story={item.story}
                        date={item.visitedDate}
                        visitedLocation={item.visitedLocation}
                        isFavourite={item.isFavorite}
                        onClick={() => handleViewStory(item)}
                        onFavouriteClick={() => updateIsFavourite(item)}
                      />

                      <div className="mt-4 flex items-center gap-4">
                        <LikeButton
                          storyId={item._id}
                          initialLikes={item.likes || []}
                          userId={useSelector((state) => state.user.currentUser)?._id}
                          onLikeUpdate={(updatedLikes) => {
                            // Update the local state
                            setPublicStories(prevStories =>
                              prevStories.map(story =>
                                story._id === item._id
                                  ? { ...story, likes: updatedLikes }
                                  : story
                              )
                            )
                          }}
                        />
                      </div>

                      <CommentSection
                        storyId={item._id}
                        comments={item.comments || []}
                        onCommentUpdate={(updatedComments) => {
                          // Update the local state
                          setPublicStories(prevStories =>
                            prevStories.map(story =>
                              story._id === item._id
                                ? { ...story, comments: updatedComments }
                                : story
                            )
                          )
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No public stories available yet.</p>
                <p className="text-gray-400 mt-2">Be the first to share your travel experiences!</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add & Edit Travel Story Modal */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <AddEditTravelStory
          storyInfo={openAddEditModal.data}
          type={openAddEditModal.type}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null })
          }}
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>

      {/* View travel story modal */}
      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
        appElement={document.getElementById("root")}
        className="w-[80vw] md:w-[40%] h-[80vh] bg-white rounded-lg mx-auto mt-14 p-5 overflow-y-scroll scrollbar z-50"
      >
        <ViewTravelStory
          storyInfo={openViewModal.data || null}
          onClose={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
          }}
          onEditClick={() => {
            setOpenViewModal((prevState) => ({ ...prevState, isShown: false }))
            handleEdit(openViewModal.data || null)
          }}
          onDeleteClick={() => {
            deleteTravelStory(openViewModal.data || null)
          }}
        />
      </Modal>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-full bg-[#05b6d3] hover:bg-cyan-400 fixed right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShown: true, type: "add", data: null })
        }}
      >
        <IoMdAdd className="text-[32px] text-white" />
      </button>

      <ToastContainer />
    </>
  )
}

export default Home
