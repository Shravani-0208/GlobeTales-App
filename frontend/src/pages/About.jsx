import React from "react"
import { useNavigate } from "react-router-dom"

const About = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-800">GlobeTales</div>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/")}
                className="text-gray-600 hover:text-gray-900 transition duration-300"
              >
                Home
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-gray-900 transition duration-300"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/sign-up")}
                className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition duration-300"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">About GlobeTales</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Your ultimate companion for capturing and sharing unforgettable travel experiences
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-6">
              At GlobeTales, we believe that every journey tells a story. Our platform empowers travelers
              to document their adventures, share their experiences, and connect with fellow explorers
              from around the world.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Whether you're planning your next trip or reminiscing about past adventures, GlobeTales
              provides the tools you need to create lasting memories and discover new destinations.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Create and share travel stories with photos
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Build your personal bucket list
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Connect with other travelers
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                Discover new destinations and experiences
              </li>
            </ul>
          </div>
        </div>


      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 GlobeTales. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default About
