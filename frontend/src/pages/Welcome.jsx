import React from "react"
import { useNavigate } from "react-router-dom"

const Welcome = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative">
      {/* Hero Background */}
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80')"}}></div>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>

      {/* Navigation */}
      <nav className="relative z-20 flex justify-between items-center p-6">
        <div className="text-white text-2xl font-bold">TravelDiary</div>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="text-white hover:text-gray-300 transition duration-300"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate("/sign-up")}
            className="bg-white text-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl text-white font-bold leading-tight mb-6">
            Capture Your
            <span className="block text-yellow-400">Travel Stories</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 leading-relaxed mb-8 max-w-2xl mx-auto">
            Document your adventures, share your experiences, and create memories that last forever
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex bg-white rounded-full shadow-lg overflow-hidden">
              <input
                type="text"
                placeholder="Where do you want to go?"
                className="flex-1 px-6 py-3 text-gray-700 focus:outline-none"
              />
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 transition duration-300">
                Search
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/sign-up")}
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold text-lg px-8 py-4 rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
            >
              Start Your Journey
            </button>
            <button
              onClick={() => navigate("/login")}
              className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-lg px-8 py-4 rounded-full transition duration-300"
            >
              Explore Stories
            </button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default Welcome
