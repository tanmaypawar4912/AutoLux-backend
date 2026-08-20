const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // ======================================
    // CLERK USER ID
    // ======================================

    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    // ======================================
    // USER NAME
    // ======================================

    firstName: {
      type: String,
      default: "",
      trim: true,
    },

    lastName: {
      type: String,
      default: "",
      trim: true,
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    // ======================================
    // EMAIL
    // ======================================

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // ======================================
    // PROFILE IMAGE
    // ======================================

    image: {
      type: String,
      default: "",
      trim: true,
    },

    // ======================================
    // ROLE
    // ======================================

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "User",
  userSchema
);