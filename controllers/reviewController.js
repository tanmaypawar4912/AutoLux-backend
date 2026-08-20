const Review = require("../models/Review");

// ======================================
// ADD REVIEW
// ======================================
const addReview = async (req, res) => {
  try {
    const {
      carId,
      reviewerName,
      reviewerEmail,
      rating,
      comment,
    } = req.body;

    if (
      !carId ||
      !reviewerName ||
      !reviewerEmail ||
      !rating ||
      !comment
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const review = await Review.create({
      carId,
      reviewerName,
      reviewerEmail,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET REVIEWS FOR A CAR
// ======================================
const getReviewsForCar = async (req, res) => {
  try {
    const reviews = await Review.find({
      carId: req.params.carId,
    }).sort({
      createdAt: -1,
    });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        : 0;

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating:
        Math.round(averageRating * 10) / 10,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get Car Reviews Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL REVIEWS FOR ADMIN
// ======================================
const getAllReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate(
        "carId",
        "brand model year price image"
      )
      .sort({
        createdAt: -1,
      });

    const averageRating =
      reviews.length > 0
        ? reviews.reduce(
            (sum, review) => sum + review.rating,
            0
          ) / reviews.length
        : 0;

    const ratingBreakdown = {
      fiveStar: reviews.filter(
        (review) => review.rating === 5
      ).length,

      fourStar: reviews.filter(
        (review) => review.rating === 4
      ).length,

      threeStar: reviews.filter(
        (review) => review.rating === 3
      ).length,

      twoStar: reviews.filter(
        (review) => review.rating === 2
      ).length,

      oneStar: reviews.filter(
        (review) => review.rating === 1
      ).length,
    };

    res.status(200).json({
      success: true,
      count: reviews.length,
      averageRating:
        Math.round(averageRating * 10) / 10,
      ratingBreakdown,
      reviews,
    });
  } catch (error) {
    console.error(
      "Get Admin Reviews Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// DELETE REVIEW
// ======================================
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(
      req.params.id
    );

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Review Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  addReview,
  getReviewsForCar,
  getAllReviewsForAdmin,
  deleteReview,
};