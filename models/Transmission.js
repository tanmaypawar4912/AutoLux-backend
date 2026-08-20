const mongoose = require("mongoose");

const transmissionSchema = new mongoose.Schema(
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
    collection: "transmissions",
  }
);

module.exports = mongoose.model(
  "Transmission",
  transmissionSchema
);