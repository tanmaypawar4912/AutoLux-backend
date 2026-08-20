const express = require("express");
const { requireAuth } = require("@clerk/express");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  addReview,
  getReviewsForCar,
  getAllReviewsForAdmin,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

// ======================================
// ADD REVIEW
// ======================================

router.post(
  "/",
  addReview
);

// ======================================
// GET ALL REVIEWS FOR ADMIN
// ======================================

router.get(
  "/admin",
  requireAuth(),
  adminMiddleware,
  getAllReviewsForAdmin
);

// ======================================
// GET REVIEWS FOR CAR
// ======================================

router.get(
  "/car/:carId",
  getReviewsForCar
);

// ======================================
// DELETE REVIEW - ADMIN
// ======================================

router.delete(
  "/:id",
  requireAuth(),
  adminMiddleware,
  deleteReview
);

module.exports = router;