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
    description: "",
    targetDate: "",
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
        ...formData,
        targetDate: formData.targetDate ? new Date(formData.targetDate).getTime() : null
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
        description: item.description,
        targetDate: item.targetDate ? new Date(item.targetDate).toISOString().split('T')[0] : "",
        priority: item.priority
      })
    } else {
      setEditingItem(null)
      setFormData({
        destination: "",
        description: "",
        targetDate: "",
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
      description: "",
      targetDate: "",
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Bucket List</h1>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <MdAdd size={20} />
            Add Destination
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : bucketList.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Your bucket list is empty</p>
            <p className="text-gray-400 mt-2">Start adding destinations you'd love to visit!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bucketList.map((item) => (
              <div
                key={item._id}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
                  item.isCompleted ? "border-green-500 bg-green-50" : "border-blue-500"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className={`text-lg font-semibold ${item.isCompleted ? "line-through text-gray-500" : "text-gray-800"}`}>
                      {item.destination}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${getPriorityColor(item.priority)}`}>
                      {item.priority}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleCompleted(item)}
                      className={`p-1 rounded-full ${
                        item.isCompleted ? "text-green-600 hover:bg-green-100" : "text-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      <MdCheckCircle size={20} />
                    </button>
                    <button
                      onClick={() => openModal(item)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                    >
                      <MdEdit size={20} />
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>

                {item.description && (
                  <p className={`text-sm mb-3 ${item.isCompleted ? "text-gray-400" : "text-gray-600"}`}>
                    {item.description}
                  </p>
                )}

                {item.targetDate && (
                  <p className={`text-xs ${item.isCompleted ? "text-gray-400" : "text-gray-500"}`}>
                    Target: {new Date(item.targetDate).toLocaleDateString()}
                  </p>
                )}
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
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                placeholder="Why do you want to visit this place?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({...formData, targetDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
  )
}

export default BucketList
