const express = require("express");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getDashboardStats,
  getCarFilters,
  getAllUsers,
} = require("../controllers/adminController");

const router = express.Router();

// ===============================
// ADMIN DASHBOARD
// (was fully public - now admin only)
// ===============================

router.get(
  "/dashboard",
  adminMiddleware,
  getDashboardStats
);

// ===============================
// ADMIN CAR FILTERS
// (was fully public - now admin only)
// ===============================

router.get(
  "/car-filters",
  adminMiddleware,
  getCarFilters
);

// ===============================
// ADMIN USERS
// (was fully public - now admin only)
// ===============================

router.get(
  "/users",
  adminMiddleware,
  getAllUsers
);

module.exports = router;