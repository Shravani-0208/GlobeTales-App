import React from "react"
import { Link, useNavigate } from "react-router-dom"
import Profile from "./Profile"
import axiosInstance from "../utils/axiosInstance"
import { signOutSuccess } from "../redux/slice/userSlice"
import { useDispatch } from "react-redux"
import SearchBar from "./SearchBar"
import { MdHome, MdList, MdMap, MdSearch, MdMessage } from "react-icons/md"

const Navbar = ({
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch,
  showSearch = true,
}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const onLogout = async () => {
    // Clear local state first for immediate logout
    dispatch(signOutSuccess())
    navigate("/login")

    try {
      // Attempt to clear cookie on backend
      await axiosInstance.post("/user/signout")
    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  }

  const onClearSearch = () => {
    handleClearSearch()
    setSearchQuery("")
  }

  return (
    <div className="bg-white flex items-center justify-between px-10 py-2 drop-shadow sticky top-0 z-10">
      <div className="flex items-center">
        <Link to={"/"}>
          <h1 className="font-bold text-2xl sm:text-2xl flex flex-wrap">
            <span className="text-blue-400">Travel</span>
            <span className="text-blue-800">Diary</span>
          </h1>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Link
          to="/home"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MdHome size={20} />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <Link
          to="/bucket-list"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MdList size={20} />
          <span className="hidden sm:inline">Bucket List</span>
        </Link>

        <Link
          to="/map"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MdMap size={20} />
          <span className="hidden sm:inline">Map</span>
        </Link>

        <Link
          to="/search-users"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MdSearch size={20} />
          <span className="hidden sm:inline">Search Users</span>
        </Link>

        <Link
          to="/messages"
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <MdMessage size={20} />
          <span className="hidden sm:inline">Messages</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {showSearch && (
          <SearchBar
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        )}

        <Profile onLogout={onLogout} />
      </div>
    </div>
  )
}

export default Navbar
