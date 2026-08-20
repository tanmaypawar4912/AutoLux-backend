const mongoose = require("mongoose");

// =====================================================
// CAR OPTION CATEGORIES
// =====================================================

const CAR_OPTION_CATEGORIES = [
  "bodyType",
  "color",
  "seats",
  "owners",
  "owner",
  "hub",
  "availability",
  "carCategory",
  "safetyFeatures",
  "features",
];

// =====================================================
// CAR OPTION SCHEMA
// =====================================================

const carOptionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: CAR_OPTION_CATEGORIES,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "car_options",
  }
);

// =====================================================
// NORMALIZE CATEGORY
// =====================================================
//
// IMPORTANT:
// Do NOT use `next` here.
// This avoids:
// "next is not a function"
// error with the current Mongoose middleware behavior.
//

carOptionSchema.pre("validate", function () {
  if (this.category === "owner") {
    this.category = "owners";
  }
});

// =====================================================
// UNIQUE CATEGORY + NAME
// =====================================================

carOptionSchema.index(
  {
    category: 1,
    name: 1,
  },
  {
    unique: true,
  }
);

// =====================================================
// MODEL
// =====================================================

module.exports = mongoose.model(
  "CarOption",
  carOptionSchema
);