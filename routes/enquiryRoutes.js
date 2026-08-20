const express = require("express");
const { requireAuth } = require("@clerk/express");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  addEnquiry,
  getEnquiriesForCar,
  getEnquiriesForSeller,
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
} = require("../controllers/enquiryController");

const router = express.Router();

// =====================================
// ADD ENQUIRY
// =====================================

router.post(
  "/",
  addEnquiry
);

// =====================================
// ADMIN - GET ALL ENQUIRIES
// =====================================

router.get(
  "/admin",
  requireAuth(),
  adminMiddleware,
  getAdminEnquiries
);

// =====================================
// GET ENQUIRIES FOR CAR
// =====================================

router.get(
  "/car/:carId",
  getEnquiriesForCar
);

// =====================================
// GET ENQUIRIES FOR SELLER
// =====================================

router.get(
  "/seller/:email",
  getEnquiriesForSeller
);

// =====================================
// ADMIN - UPDATE STATUS
// =====================================

router.put(
  "/:id/status",
  requireAuth(),
  adminMiddleware,
  updateEnquiryStatus
);

// =====================================
// ADMIN - DELETE
// =====================================

router.delete(
  "/:id",
  requireAuth(),
  adminMiddleware,
  deleteEnquiry
);

module.exports = router;