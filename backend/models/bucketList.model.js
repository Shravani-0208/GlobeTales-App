import mongoose from "mongoose"

const bucketListSchema = new mongoose.Schema(
  {
    destination: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    targetDate: {
      type: Date,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
  },
  { timestamps: true }
)

const BucketList = mongoose.model("BucketList", bucketListSchema)

export default BucketList
