const express = require("express");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getFuelTypes,
  getTransmissions,
  getAllFuelTypesAdmin,
  createFuelType,
  updateFuelType,
  deleteFuelType,
  getAllTransmissionsAdmin,
  createTransmission,
  updateTransmission,
  deleteTransmission,
  getCarOptions,
  getAllCarOptionsAdmin,
  createCarOption,
  updateCarOption,
  deleteCarOption,
} = require("../controllers/optionsController");

const router = express.Router();

// =====================================================
// PUBLIC - GET ACTIVE FUEL TYPES
// Used by Add/Edit Car forms + Buy Cars filters
// GET /api/options/fuel-types
// =====================================================

router.get("/fuel-types", getFuelTypes);

// =====================================================
// PUBLIC - GET ACTIVE TRANSMISSIONS
// GET /api/options/transmissions
// =====================================================

router.get("/transmissions", getTransmissions);

// =====================================================
// ADMIN - MANAGE FUEL TYPES
// (includes inactive ones, for the settings screen)
// =====================================================

router.get("/fuel-types/admin", adminMiddleware, getAllFuelTypesAdmin);
router.post("/fuel-types", adminMiddleware, createFuelType);
router.put("/fuel-types/:id", adminMiddleware, updateFuelType);
router.delete("/fuel-types/:id", adminMiddleware, deleteFuelType);

// =====================================================
// ADMIN - MANAGE TRANSMISSIONS
// =====================================================

router.get("/transmissions/admin", adminMiddleware, getAllTransmissionsAdmin);
router.post("/transmissions", adminMiddleware, createTransmission);
router.put("/transmissions/:id", adminMiddleware, updateTransmission);
router.delete("/transmissions/:id", adminMiddleware, deleteTransmission);


// =====================================================
// PUBLIC - GET ACTIVE CAR OPTIONS
// Used by Buy Cars filters
// =====================================================

router.get(
  "/car-options",
  getCarOptions
);

// =====================================================
// ADMIN - MANAGE CAR OPTIONS
// =====================================================

router.get(
  "/car-options/admin",
  adminMiddleware,
  getAllCarOptionsAdmin
);

router.post(
  "/car-options",
  adminMiddleware,
  createCarOption
);

router.put(
  "/car-options/:id",
  adminMiddleware,
  updateCarOption
);

router.delete(
  "/car-options/:id",
  adminMiddleware,
  deleteCarOption
);

module.exports = router;
