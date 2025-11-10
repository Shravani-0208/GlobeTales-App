import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { MdAdd, MdDelete, MdEdit, MdCheckCircle } from "react-icons/md"
import axiosInstance from "../utils/axiosInstance"
import { toast } from "react-toastify"
import Modal from "react-modal"

const BucketList = () => {
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)

  const [bucketList, setBucketList] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({
    destination: "",
    priority: "medium"
  })

  useEffect(() => {
    fetchBucketList()
  }, [])

  const fetchBucketList = async () => {
    setLoading(true)
    try {
      const response = await axiosInstance.get("/bucket-list/get-all")
      if (response.data && response.data.items) {
        setBucketList(response.data.items)
      }
    } catch (error) {
      console.error("Error fetching bucket list:", error)
      toast.error("Failed to load bucket list")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.destination.trim()) {
      toast.error("Destination is required")
      return
    }

    try {
      const data = {
        ...formData
      }

      if (editingItem) {
        await axiosInstance.put(`/bucket-list/update/${editingItem._id}`, data)
        toast.success("Bucket list item updated!")
      } else {
        await axiosInstance.post("/bucket-list/add", data)
        toast.success("Bucket list item added!")
      }

      fetchBucketList()
      closeModal()
    } catch (error) {
      console.error("Error saving bucket list item:", error)
      toast.error("Failed to save item")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return

    try {
      await axiosInstance.delete(`/bucket-list/delete/${id}`)
      toast.success("Item deleted!")
      fetchBucketList()
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete item")
    }
  }

  const toggleCompleted = async (item) => {
    try {
      await axiosInstance.put(`/bucket-list/update/${item._id}`, {
        isCompleted: !item.isCompleted
      })
      fetchBucketList()
    } catch (error) {
      console.error("Error updating item:", error)
      toast.error("Failed to update item")
    }
  }

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        destination: item.destination,
        description: item.description || "",
        targetDate: item.targetDate ? new Date(item.targetDate).toISOString().split('T')[0] : "",
        priority: item.priority
      })
    } else {
      setEditingItem(null)
      setFormData({
        destination: "",
        priority: "medium"
      })
    }
    setModalIsOpen(true)
  }

  const closeModal = () => {
    setModalIsOpen(false)
    setEditingItem(null)
    setFormData({
      destination: "",
      priority: "medium"
    })
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100"
      case "medium": return "text-yellow-600 bg-yellow-100"
      case "low": return "text-green-600 bg-green-100"
      default: return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">🌍 My Travel Bucket List</h1>
            <p className="text-lg text-gray-600 mb-8">Dream destinations waiting to be explored</p>

            <button
              onClick={() => openModal()}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <MdAdd size={24} />
              <span className="font-semibold">Add New Destination</span>
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your bucket list...</p>
            </div>
          ) : bucketList.length === 0 ? (
            <div className="text-center py-20">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">Your bucket list is empty</h2>
              <p className="text-gray-500 text-lg mb-8">Start planning your dream adventures!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {bucketList.map((item) => (
                <div
                  key={item._id}
                  className={`group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
                    item.isCompleted ? "ring-2 ring-green-300" : "hover:ring-2 hover:ring-blue-300"
                  }`}
                >
                  {/* Priority indicator */}
                  <div className={`h-1 w-full ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}></div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 ${item.isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}>
                          {item.destination}
                        </h3>
                        <div className="flex items-center gap-2 mb-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.priority === 'high' ? 'bg-red-100 text-red-700' :
                            item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.priority.toUpperCase()} PRIORITY
                          </span>
                          {item.isCompleted && (
                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              ✓ COMPLETED
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <button
                          onClick={() => toggleCompleted(item)}
                          className={`p-2 rounded-full transition-colors ${
                            item.isCompleted
                              ? "text-green-600 hover:bg-green-100"
                              : "text-gray-400 hover:bg-gray-100"
                          }`}
                          title={item.isCompleted ? "Mark as incomplete" : "Mark as completed"}
                        >
                          <MdCheckCircle size={20} />
                        </button>
                        <button
                          onClick={() => openModal(item)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                          title="Edit destination"
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                          title="Delete destination"
                        >
                          <MdDelete size={20} />
                        </button>
                      </div>
                    </div>

                    {item.description && (
                      <p className={`text-sm mb-4 leading-relaxed ${item.isCompleted ? "text-gray-400" : "text-gray-600"}`}>
                        {item.description}
                      </p>
                    )}

                    {item.targetDate && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="font-medium">Target Date:</span>
                        <span className={item.isCompleted ? "text-gray-400" : ""}>
                          {new Date(item.targetDate).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Hover overlay for mobile */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300 md:hidden"></div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Modal for Add/Edit */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
        contentLabel="Bucket List Item"
      >
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4">
            {editingItem ? "Edit Destination" : "Add New Destination"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Destination *
              </label>
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Paris, France"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                {editingItem ? "Update" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      </div>
    </div>
  )
}

export default BucketList
