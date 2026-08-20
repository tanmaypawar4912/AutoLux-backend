const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    carId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One user can save a car only once.
// Different users can save the same car.
wishlistSchema.index(
  { carId: 1, userEmail: 1 },
  { unique: true }
);

module.exports = mongoose.model(
  "Wishlist",
  wishlistSchema
);
