import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import axiosInstance from "../utils/axiosInstance"
import { useDispatch, useSelector } from "react-redux"
import { signInSuccess } from "../redux/slice/userSlice"
import ImageSelector from "../components/ImageSelector"
import uploadImage from "../utils/uploadImage"

const EditProfile = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  const [formData, setFormData] = useState({
    username: "",
    bio: "",
    favoriteDestinations: [],
  })
  const [profileImage, setProfileImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        bio: currentUser.bio || "",
        favoriteDestinations: currentUser.favoriteDestinations || [],
      })
      setProfileImage(currentUser?.profilePicture || null)
    }
  }, [currentUser])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddDestination = (destination) => {
    if (destination.trim() && !formData.favoriteDestinations.includes(destination.trim())) {
      setFormData(prev => ({
        ...prev,
        favoriteDestinations: [...prev.favoriteDestinations, destination.trim()]
      }))
    }
  }

  const handleRemoveDestination = (index) => {
    setFormData(prev => ({
      ...prev,
      favoriteDestinations: prev.favoriteDestinations.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      let profilePictureUrl = currentUser?.profilePicture || ""

      // Upload profile image if present and it's a new file (not a URL)
      if (profileImage && typeof profileImage !== 'string') {
        const imgUploadRes = await uploadImage(profileImage)
        profilePictureUrl = imgUploadRes.imageUrl || ""
      } else if (profileImage && typeof profileImage === 'string') {
        profilePictureUrl = profileImage
      }

      const response = await axiosInstance.put("/user/update-profile", {
        bio: formData.bio,
        favoriteDestinations: formData.favoriteDestinations,
        profilePicture: profilePictureUrl,
      })

      if (response.data) {
        dispatch(signInSuccess(response.data.user))
        navigate("/home")
      }
    } catch (error) {
      setError("Failed to update profile. Please try again.")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={() => {}}
        handleClearSearch={handleClearSearch}
      />

      <div className="min-h-screen bg-gray-100 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Username cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Picture
                </label>
                <ImageSelector
                  image={profileImage}
                  setImage={setProfileImage}
                  handleDeleteImage={() => setProfileImage(null)}
                />
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                  Bio
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Favorite Destinations
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add a destination"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddDestination(e.target.value)
                        e.target.value = ""
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      const input = e.target.previousElementSibling
                      handleAddDestination(input.value)
                      input.value = ""
                    }}
                    className="px-4 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.favoriteDestinations.map((dest, index) => (
                    <span
                      key={index}
                      className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                      {dest}
                      <button
                        type="button"
                        onClick={() => handleRemoveDestination(index)}
                        className="text-cyan-600 hover:text-cyan-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-cyan-500 text-white py-2 px-4 rounded-md hover:bg-cyan-600 transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/home")}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default EditProfile
