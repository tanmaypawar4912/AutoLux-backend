const mongoose = require("mongoose");

const carSchema = new mongoose.Schema(
  {
    // ==========================
    // Seller Information
    // ==========================

    sellerName: {
      type: String,
      required: true,
      trim: true,
    },

    sellerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // ==========================
    // Car Information
    // ==========================

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    model: {
      type: String,
      required: true,
      trim: true,
    },

    year: {
      type: Number,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    kilometers: {
      type: Number,
      required: true,
    },

    fuelType: {
      type: String,
      required: true,
      trim: true,
    },

    transmission: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================
    // Dynamic Filter Fields
    // ==========================

    bodyType: {
      type: String,
      trim: true,
      default: "",
    },

    color: {
      type: String,
      trim: true,
      default: "",
    },

    seats: {
      type: Number,
      default: 5,
    },

    // IMPORTANT:
    // Owners is STRING because Admin Settings
    // contains values like:
    // 1st Owner
    // 2nd Owners
    // 3rd owner
    // 4th Owners

    owners: {
      type: String,
      trim: true,
      default: "1st Owner",
    },

    hub: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================
    // CAR AVAILABILITY
    // Admin Controlled
    // ==========================

    availability: {
      type: String,
      trim: true,
      enum: ["Stock", "Reserved", "Sold"],
      default: "Stock",
    },

    carCategory: {
      type: String,
      trim: true,
      default: "",
    },

    safetyFeatures: {
      type: [String],
      default: [],
    },

    features: {
      type: [String],
      default: [],
    },

    // ==========================
    // Description
    // ==========================

    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ==========================
    // OLD IMAGE FIELD
    // Kept for existing UI
    // ==========================

    image: {
      type: String,
      default: "",
    },

    // ==========================
    // FOUR CAR IMAGES
    // ==========================

    images: {
      front: {
        type: String,
        default: "",
      },

      back: {
        type: String,
        default: "",
      },

      left: {
        type: String,
        default: "",
      },

      right: {
        type: String,
        default: "",
      },
    },

    // ==========================
    // Location
    // ==========================

    city: {
      type: String,
      trim: true,
      default: "",
    },

    // ==========================
    // Views
    // ==========================

    views: {
      type: Number,
      default: 0,
    },

    // ==========================
    // Admin Controls
    // ==========================

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
      ],
      default: "pending",
    },

    addedBy: {
      type: String,
      enum: [
        "seller",
        "admin",
      ],
      default: "seller",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    // ==========================
    // OLD STOCK FIELD
    // Kept for compatibility
    //
    // Stock      => true
    // Reserved   => false
    // Sold       => false
    // ==========================

    stock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.model("Car", carSchema);