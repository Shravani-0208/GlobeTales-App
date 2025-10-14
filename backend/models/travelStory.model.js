import mongoose, { Schema } from "mongoose"

const travelStorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    story: {
      type: String,
      required: true,
    },

    visitedLocation: {
      type: [String],
      default: [],
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    isPublic: {
      type: Boolean,
      default: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    imageUrl: {
      type: String,
      required: true,
    },

    visitedDate: {
      type: Date,
      required: true,
    },

    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }],

    comments: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      username: {
        type: String,
        required: true
      },
      text: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
  },
  { timestamps: true }
)

const TravelStory = mongoose.model("TravelStory", travelStorySchema)

export default TravelStory
