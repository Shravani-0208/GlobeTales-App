import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import axiosInstance from "../utils/axiosInstance"
import { getInitials } from "../utils/helper"
import { MdSearch, MdPerson, MdLocationOn } from "react-icons/md"

const SearchUsers = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [navSearchQuery, setNavSearchQuery] = useState("")

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setUsers([])
      return
    }

    setLoading(true)
    try {
      const response = await axiosInstance.get("/user/search", {
        params: { query: query.trim() }
      })

      if (response.data && response.data.users) {
        setUsers(response.data.users)
      }
    } catch (error) {
      console.log("Error searching users:", error)
      setUsers([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        searchUsers(searchQuery)
      } else {
        setUsers([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  const handleUserClick = (userId) => {
    navigate(`/user/${userId}`)
  }

  const handleClearSearch = () => {
    setNavSearchQuery("")
  }

  return (
    <>
      <Navbar
        searchQuery={navSearchQuery}
        setSearchQuery={setNavSearchQuery}
        onSearchNote={() => {}}
        handleClearSearch={handleClearSearch}
      />

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
              Search Users
            </h1>
            <p className="text-gray-600 text-center mb-6">
              Find other travelers and explore their stories
            </p>

            {/* Search Input */}
            <div className="relative">
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none text-lg"
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="space-y-4">
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              </div>
            )}

            {!loading && searchQuery && users.length === 0 && (
              <div className="text-center py-12">
                <MdPerson className="mx-auto text-gray-400 text-4xl mb-4" />
                <p className="text-gray-500 text-lg">No users found</p>
                <p className="text-gray-400 text-sm mt-2">
                  Try searching with a different username or email
                </p>
              </div>
            )}

            {!loading && users.length > 0 && (
              <>
                <p className="text-gray-600 mb-4">
                  Found {users.length} user{users.length !== 1 ? 's' : ''}
                </p>
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      {/* Profile Picture */}
                      <div className="w-16 h-16 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 text-xl">
                        {getInitials(user.username)}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {user.username}
                        </h3>
                        <p className="text-gray-500 text-sm mb-2">
                          {user.email}
                        </p>

                        {user.bio && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {user.bio}
                          </p>
                        )}

                        {user.favoriteDestinations && user.favoriteDestinations.length > 0 && (
                          <div className="flex items-center gap-1 mt-2">
                            <MdLocationOn className="text-gray-400 text-sm" />
                            <span className="text-gray-500 text-sm">
                              {user.favoriteDestinations.slice(0, 3).join(", ")}
                              {user.favoriteDestinations.length > 3 && "..."}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {!searchQuery && (
              <div className="text-center py-12">
                <MdSearch className="mx-auto text-gray-400 text-4xl mb-4" />
                <p className="text-gray-500 text-lg">Start typing to search users</p>
                <p className="text-gray-400 text-sm mt-2">
                  Search by username or email address
                </p>
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </>
  )
}

export default SearchUsers
