import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ This creates a unique index in MongoDB
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    isBlocked: { type: Boolean, default: false },
    /* status: {
      type: String,
      enum: ["active", "blocked"],
      default: "active",
    }, */
    lastLogin: {
      type: Date,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in dev
export default mongoose.models.User || mongoose.model("User", userSchema);
