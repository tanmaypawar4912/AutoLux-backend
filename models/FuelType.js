const mongoose = require("mongoose");

const fuelTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    collection: "fuel_type",
  }
);

module.exports = mongoose.model(
  "FuelType",
  fuelTypeSchema
);