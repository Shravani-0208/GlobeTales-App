import React from "react"
import { useNavigate } from "react-router-dom"

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-200 via-purple-200 to-indigo-200">
      {/* Hero Background Pattern */}
      <div className="absolute inset-0 opacity-10">k
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6">
        <div className="text-gray-900 text-2xl font-bold">GlobeTales</div>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/about")}
            className="text-gray-900 hover:text-gray-700 transition duration-300"
          >
            About Us
          </button>
          <button
            onClick={() => navigate("/login")}
            className="text-gray-900 hover:text-gray-700 transition duration-300"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl text-gray-900 font-bold leading-tight mb-6">
            Capture Your
            <span className="block text-yellow-600">Travel Stories</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-8 max-w-2xl mx-auto">
            Document your adventures, share your experiences, and create memories that last forever
          </p>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-lg p-6 border border-gray-300">
              <div className="text-yellow-600 text-3xl mb-3">📖</div>
              <h3 className="text-gray-900 text-lg font-semibold mb-2">Create Stories</h3>
              <p className="text-gray-600 text-sm">Share your travel experiences with rich media and detailed narratives</p>
            </div>
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-lg p-6 border border-gray-300">
              <div className="text-yellow-600 text-3xl mb-3">🗺️</div>
              <h3 className="text-gray-900 text-lg font-semibold mb-2">Explore Places</h3>
              <p className="text-gray-600 text-sm">Discover new destinations and get inspired by fellow travelers</p>
            </div>
            <div className="bg-gray-100/80 backdrop-blur-sm rounded-lg p-6 border border-gray-300">
              <div className="text-yellow-600 text-3xl mb-3">🤝</div>
              <h3 className="text-gray-900 text-lg font-semibold mb-2">Connect</h3>
              <p className="text-gray-600 text-sm">Build a community of travelers and share your journey</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-semibold text-lg px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Explore
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-white/20 backdrop-blur-sm border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center text-gray-700 text-sm">
            <div>&copy; 2024 GlobeTales. All rights reserved.</div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
              <a href="#" className="hover:text-gray-900 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Welcome
