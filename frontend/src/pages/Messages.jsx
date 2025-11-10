import React, { useEffect, useState, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import axiosInstance from "../utils/axiosInstance"
import { useSelector } from "react-redux"
import { getInitials } from "../utils/helper"
import { IoSend } from "react-icons/io5"
import { BsChatDots } from "react-icons/bs"

const Messages = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useSelector((state) => state.user)
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    getConversations()
  }, [])

  useEffect(() => {
    if (userId) {
      getMessages(userId)
      setSelectedUser(userId)
    }
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getConversations = async () => {
    try {
      const response = await axiosInstance.get("/messages/conversations")
      if (response.data) {
        setConversations(response.data.conversations)
      }
    } catch (error) {
      console.log("Error fetching conversations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getMessages = async (userId) => {
    try {
      const response = await axiosInstance.get(`/messages/${userId}`)
      if (response.data) {
        setMessages(response.data.messages)
      }
    } catch (error) {
      console.log("Error fetching messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return

    try {
      const response = await axiosInstance.post("/messages/send", {
        receiverId: selectedUser,
        content: newMessage.trim(),
      })

      if (response.data) {
        setMessages(prev => [...prev, response.data.data])
        setNewMessage("")
        getConversations() // Refresh conversations to update last message
      }
    } catch (error) {
      console.log("Error sending message:", error)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleClearSearch = () => {
    setSearchQuery("")
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatDate = (date) => {
    const messageDate = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (messageDate.toDateString() === today.toDateString()) {
      return "Today"
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return "Yesterday"
    } else {
      return messageDate.toLocaleDateString()
    }
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

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSearchNote={() => {}}
        handleClearSearch={handleClearSearch}
      />

      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto py-8 px-4">
          <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] flex">
            {/* Conversations Sidebar */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((conv) => (
                    <div
                      key={conv.user._id}
                      onClick={() => {
                        setSelectedUser(conv.user._id)
                        navigate(`/messages/${conv.user._id}`)
                      }}
                      className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        selectedUser === conv.user._id ? "bg-cyan-50 border-r-4 border-r-cyan-500" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {conv.user.profilePicture ? (
                          <img
                            src={conv.user.profilePicture}
                            alt={conv.user.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
                            {getInitials(conv.user.username)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-800 truncate">
                            {conv.user.username}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {conv.lastMessage.content}
                          </p>
                        </div>
                        <div className="text-xs text-gray-400">
                          {formatTime(conv.lastMessage.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <BsChatDots size={48} className="mb-4" />
                    <p>No conversations yet</p>
                    <p className="text-sm">Start messaging with other travelers!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  {/* Message Header */}
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      {conversations.find(c => c.user._id === selectedUser)?.user?.profilePicture ? (
                        <img
                          src={conversations.find(c => c.user._id === selectedUser).user.profilePicture}
                          alt={conversations.find(c => c.user._id === selectedUser).user.username}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
                          {getInitials(conversations.find(c => c.user._id === selectedUser)?.user?.username)}
                        </div>
                      )}
                      <h3 className="font-semibold text-gray-800">
                        {conversations.find(c => c.user._id === selectedUser)?.user?.username}
                      </h3>
                    </div>
                  </div>

                  {/* Messages List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => {
                      const showDate = index === 0 || formatDate(messages[index - 1].createdAt) !== formatDate(message.createdAt)
                      return (
                        <div key={message._id}>
                          {showDate && (
                            <div className="text-center my-4">
                              <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                                {formatDate(message.createdAt)}
                              </span>
                            </div>
                          )}
                          <div
                            className={`flex ${message.sender._id === currentUser._id ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender._id === currentUser._id
                                  ? "bg-cyan-500 text-white"
                                  : "bg-gray-200 text-gray-800"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender._id === currentUser._id ? "text-cyan-100" : "text-gray-500"
                              }`}>
                                {formatTime(message.createdAt)}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IoSend size={20} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BsChatDots size={64} className="mb-4 mx-auto" />
                    <p className="text-lg">Select a conversation to start messaging</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Messages
