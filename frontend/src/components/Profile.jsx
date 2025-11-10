import React from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { getInitials } from "../utils/helper"

const Profile = ({ onLogout }) => {
  const { currentUser } = useSelector((state) => state.user)
  const navigate = useNavigate()

  return (
    <div className="flex items-center gap-3">
      {currentUser?.profilePicture ? (
        <img
          src={currentUser.profilePicture}
          alt="Profile"
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {getInitials(currentUser?.username)}
        </div>
      )}

      <div>
        <p className="text-lg font-medium">{currentUser.username || ""}</p>

        <div className="flex gap-2">
          <button
            className="text-sm text-cyan-600 underline hover:text-cyan-800"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
          <button className="text-sm text-red-600 underline" onClick={onLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default Profile
