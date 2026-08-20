const express = require("express");
const { requireAuth } = require("@clerk/express");

const {
  syncUser,
} = require("../controllers/userController");

const router = express.Router();

// ======================================
// SYNC LOGGED-IN USER
// ======================================

router.post(
  "/sync",
  requireAuth(),
  syncUser
);

module.exports = router;