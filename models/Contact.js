const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: String,
      required: true,
      enum: [
        "General Inquiry",
        "Car Information",
        "Book a Test Drive",
        "Sell My Car",
        "Car Financing / EMI",
        "Booking Related",
        "Website / Technical Issue",
        "Complaint",
        "Feedback / Suggestion",
        "Other",
      ],
    },

    interestedCar: {
      type: String,
      default: "",
      trim: true,
    },

    preferredContact: {
      type: String,
      enum: [
        "Email",
        "Phone",
        "WhatsApp",
        "Any",
      ],
      default: "Any",
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: [
        "New",
        "In Progress",
        "Resolved",
        "Closed",
      ],
      default: "New",
    },

    priority: {
      type: String,
      enum: [
        "Low",
        "Normal",
        "High",
      ],
      default: "Normal",
    },

    clerkUserId: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
