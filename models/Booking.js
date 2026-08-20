const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    // =====================================
    // CAR DETAILS
    // =====================================

    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    carBrand: {
      type: String,
      required: true,
      trim: true,
    },

    carModel: {
      type: String,
      required: true,
      trim: true,
    },

    carImage: {
      type: String,
      default: "",
      trim: true,
    },

    sellerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    // =====================================
    // CUSTOMER DETAILS
    // =====================================

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    customerPhone: {
      type: String,
      required: true,
      trim: true,
    },

    // =====================================
    // BOOKING DETAILS
    // =====================================

    preferredDate: {
      type: String,
      required: true,
      trim: true,
    },

    preferredTime: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      default: "",
      trim: true,
    },

    // =====================================
    // BOOKING STATUS
    // =====================================

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "completed",
        "rejected",
        "cancelled",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);