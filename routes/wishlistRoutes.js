const express = require("express");
const { requireAuth } = require("@clerk/express");

const adminMiddleware = require("../middleware/adminMiddleware");

const {
  addToWishlist,
  getMyWishlist,
  getAdminWishlist,
  removeWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

// =====================================
// ADD TO WISHLIST
// POST /api/wishlist
// LOGIN REQUIRED
// =====================================

router.post(
  "/",
  requireAuth(),
  addToWishlist
);

// =====================================
// GET MY PERSONAL WISHLIST
// GET /api/wishlist/me
// LOGIN REQUIRED
// =====================================

router.get(
  "/me",
  requireAuth(),
  getMyWishlist
);

// =====================================
// ADMIN - GET ALL USERS WISHLISTS
// GET /api/wishlist/admin
// =====================================

router.get(
  "/admin",
  requireAuth(),
  adminMiddleware,
  getAdminWishlist
);

// =====================================
// REMOVE WISHLIST
// DELETE /api/wishlist/:id
// LOGIN REQUIRED
// User = own item only
// Admin = any item
// =====================================

router.delete(
  "/:id",
  requireAuth(),
  removeWishlist
);

module.exports = router;