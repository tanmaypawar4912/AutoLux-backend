const express = require("express");
const { requireAuth } = require("@clerk/express");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  addContact,
  getAdminContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

const router = express.Router();

// =====================================
// CREATE CONTACT MESSAGE
// POST /api/contacts
// =====================================

router.post(
  "/",
  requireAuth(),
  addContact
);

// =====================================
// ADMIN - GET CONTACT MESSAGES
// GET /api/contacts/admin
// =====================================

router.get(
  "/admin",
  requireAuth(),
  adminMiddleware,
  getAdminContacts
);

// =====================================
// ADMIN - UPDATE CONTACT
// PUT /api/contacts/:id
// =====================================

router.put(
  "/:id",
  requireAuth(),
  adminMiddleware,
  updateContact
);

// =====================================
// ADMIN - DELETE CONTACT
// DELETE /api/contacts/:id
// =====================================

router.delete(
  "/:id",
  requireAuth(),
  adminMiddleware,
  deleteContact
);

module.exports = router;
