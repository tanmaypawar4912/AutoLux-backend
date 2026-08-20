const express = require("express");

const adminMiddleware = require(
  "../middleware/adminMiddleware"
);

const {
  addCar,
  addAdminCar,
  getCars,
  getAllCarsAdmin,
  getCarById,
  updateCarStatus,
  updateCar,
  deleteCar,
  getMyCars,
  incrementCarView,
} = require("../controllers/carController");

const router = express.Router();

// ======================================
// PUBLIC - GET APPROVED CARS
// ======================================

router.get(
  "/",
  getCars
);

// ======================================
// SELLER - GET MY CARS
// ======================================

router.get(
  "/my/:email",
  getMyCars
);

// ======================================
// ADMIN - GET ALL CARS
// ======================================

router.get(
  "/admin",
  adminMiddleware,
  getAllCarsAdmin
);

// ======================================
// ADMIN - ADD CAR
// ======================================

router.post(
  "/admin",
  adminMiddleware,
  addAdminCar
);

// ======================================
// SELLER - ADD CAR
// ======================================

router.post(
  "/add",
  addCar
);

// ======================================
// GET SINGLE CAR
// ======================================

router.get(
  "/:id",
  getCarById
);

// ======================================
// ADMIN - UPDATE STATUS
// ======================================

router.put(
  "/:id/status",
  adminMiddleware,
  updateCarStatus
);

// ======================================
// ADMIN - UPDATE CAR
// ======================================

router.put(
  "/:id",
  adminMiddleware,
  updateCar
);

// ======================================
// CAR VIEW
// ======================================

router.patch(
  "/:id/view",
  incrementCarView
);

// ======================================
// ADMIN - DELETE CAR
// ======================================

router.delete(
  "/:id",
  adminMiddleware,
  deleteCar
);

module.exports = router;