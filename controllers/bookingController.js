const Booking = require("../models/Booking");

// ======================================
// CREATE BOOKING
// ======================================

const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Create Booking Error:", error);

    res.status(500).json({
      success: false,
      message: "Booking failed",
    });
  }
};

// ======================================
// GET ALL BOOKINGS
// ADMIN
// ======================================

const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch bookings",
    });
  }
};

// ======================================
// GET MY BOOKINGS
// ======================================

const getMyBookings = async (req, res) => {
  try {
    const email = req.params.email
      ?.trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Customer email is required",
      });
    }

    const bookings = await Booking.find({
      customerEmail: email,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error("Get My Bookings Error:", error);

    res.status(500).json({
      success: false,
      message: "Unable to fetch your bookings",
    });
  }
};

// ======================================
// GET SELLER BOOKINGS
// ======================================

const getSellerBookings = async (req, res) => {
  try {
    const email = req.params.email
      ?.trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Seller email is required",
      });
    }

    const bookings = await Booking.find({
      sellerEmail: email,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    console.error(
      "Get Seller Bookings Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch seller bookings",
    });
  }
};

// ======================================
// UPDATE BOOKING STATUS
// ======================================

const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "approved",
      "completed",
      "rejected",
      "cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Booking status is required",
      });
    }

    const normalizedStatus = status
      .trim()
      .toLowerCase();

    if (!allowedStatuses.includes(normalizedStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking =
      await Booking.findByIdAndUpdate(
        req.params.id,
        {
          status: normalizedStatus,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error(
      "Update Booking Status Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to update booking",
    });
  }
};

// ======================================
// DELETE BOOKING
// ======================================

const deleteBooking = async (req, res) => {
  try {
    const booking =
      await Booking.findByIdAndDelete(
        req.params.id
      );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Booking Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Unable to delete booking",
    });
  }
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  createBooking,
  getBookings,
  getMyBookings,
  getSellerBookings,
  updateBookingStatus,
  deleteBooking,
};