const express = require("express");
const { requireAuth } = require("@clerk/express");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createBooking,
  getBookings,
  getMyBookings,
  updateBookingStatus,
  deleteBooking,
  getSellerBookings,
} = require("../controllers/bookingController");

const router = express.Router();

// ======================================
// CREATE BOOKING
// POST /api/bookings
// ======================================

router.post(
  "/",
  createBooking
);

// ======================================
// GET ALL BOOKINGS - ADMIN
// GET /api/bookings
// ======================================

router.get(
  "/",
  requireAuth(),
  adminMiddleware,
  getBookings
);

// ======================================
// GET MY BOOKINGS
// GET /api/bookings/my/:email
// ======================================

router.get(
  "/my/:email",
  getMyBookings
);

// ======================================
// GET SELLER BOOKINGS
// GET /api/bookings/seller/:email
// ======================================

router.get(
  "/seller/:email",
  getSellerBookings
);

// ======================================
// UPDATE BOOKING STATUS
// PUT /api/bookings/:id/status
// ======================================

router.put(
  "/:id/status",
  updateBookingStatus
);

// ======================================
// DELETE BOOKING
// DELETE /api/bookings/:id
// ======================================

router.delete(
  "/:id",
  deleteBooking
);

// ======================================
// EXPORT
// ======================================

module.exports = router;