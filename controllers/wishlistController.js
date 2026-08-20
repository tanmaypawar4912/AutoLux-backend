const { getAuth, clerkClient } = require("@clerk/express");
const Wishlist = require("../models/Wishlist");

// ======================================
// GET CURRENT CLERK USER
// ======================================

const getCurrentClerkUser = async (req) => {
  const auth = getAuth(req);

  const userId = auth?.userId;

  console.log("=================================");
  console.log("WISHLIST AUTH CHECK");
  console.log(
    "Authorization:",
    req.headers.authorization
      ? "TOKEN PRESENT"
      : "NO TOKEN"
  );
  console.log(
    "AUTH USER ID:",
    userId
  );
  console.log("=================================");

  if (!userId) {
    return null;
  }

  return clerkClient.users.getUser(userId);
};

// ======================================
// ADD TO WISHLIST
// POST /api/wishlist
// ======================================

const addToWishlist = async (req, res) => {
  try {
    const clerkUser =
      await getCurrentClerkUser(req);

    if (!clerkUser) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const { carId } = req.body;

    if (!carId) {
      return res.status(400).json({
        success: false,
        message: "carId is required.",
      });
    }

    const primaryEmail =
      clerkUser.emailAddresses?.find(
        (email) =>
          email.id ===
          clerkUser.primaryEmailAddressId
      );

    const email = (
      primaryEmail?.emailAddress ||
      clerkUser.emailAddresses?.[0]
        ?.emailAddress ||
      ""
    )
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email not found.",
      });
    }

    const userName =
      [
        clerkUser.firstName,
        clerkUser.lastName,
      ]
        .filter(Boolean)
        .join(" ") || "User";

    const existing =
      await Wishlist.findOne({
        carId,
        userEmail: email,
      });

    if (existing) {
      return res.status(200).json({
        success: true,
        message:
          "Car already exists in wishlist.",
        wishlist: existing,
      });
    }

    const wishlist =
      await Wishlist.create({
        carId,
        userEmail: email,
        userName,
      });

    return res.status(201).json({
      success: true,
      message:
        "Car added to wishlist.",
      wishlist,
    });
  } catch (error) {
    console.error(
      "Add Wishlist Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message || "Server Error",
    });
  }
};

// ======================================
// GET MY PERSONAL WISHLIST
// GET /api/wishlist/me
// ======================================

const getMyWishlist = async (req, res) => {
  try {
    const clerkUser =
      await getCurrentClerkUser(req);

    if (!clerkUser) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const primaryEmail =
      clerkUser.emailAddresses?.find(
        (email) =>
          email.id ===
          clerkUser.primaryEmailAddressId
      );

    const email = (
      primaryEmail?.emailAddress ||
      clerkUser.emailAddresses?.[0]
        ?.emailAddress ||
      ""
    )
      .trim()
      .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,
        message:
          "User email not found.",
      });
    }

    console.log(
      "GET MY WISHLIST EMAIL:",
      email
    );

    const wishlist =
      await Wishlist.find({
        userEmail: email,
      })
        .populate(
          "carId",
          "brand model year price image fuelType transmission description city"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error(
      "Get My Wishlist Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message || "Server Error",
    });
  }
};

// ======================================
// ADMIN - GET ALL WISHLISTS
// GET /api/wishlist/admin
// ======================================

const getAdminWishlist = async (
  req,
  res
) => {
  try {
    const wishlist =
      await Wishlist.find()
        .populate(
          "carId",
          "brand model year price image fuelType transmission description city"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: wishlist.length,
      wishlist,
    });
  } catch (error) {
    console.error(
      "Get Admin Wishlist Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to fetch admin wishlist.",
    });
  }
};

// ======================================
// REMOVE WISHLIST
// DELETE /api/wishlist/:id
// ======================================

const removeWishlist = async (
  req,
  res
) => {
  try {
    const auth = getAuth(req);

    const userId =
      auth?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    const wishlist =
      await Wishlist.findById(
        req.params.id
      );

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message:
          "Wishlist item not found.",
      });
    }

    // ====================================
    // ADMIN CAN REMOVE ANY ITEM
    // ====================================

    if (
      userId ===
      process.env.ADMIN_USER_ID
    ) {
      await wishlist.deleteOne();

      return res.status(200).json({
        success: true,
        message:
          "Wishlist item removed successfully.",
      });
    }

    // ====================================
    // NORMAL USER
    // ====================================

    const clerkUser =
      await clerkClient.users.getUser(
        userId
      );

    const primaryEmail =
      clerkUser.emailAddresses?.find(
        (email) =>
          email.id ===
          clerkUser.primaryEmailAddressId
      );

    const email = (
      primaryEmail?.emailAddress ||
      clerkUser.emailAddresses?.[0]
        ?.emailAddress ||
      ""
    )
      .trim()
      .toLowerCase();

    if (
      wishlist.userEmail !== email
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only remove your own wishlist items.",
      });
    }

    await wishlist.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Wishlist item removed successfully.",
    });
  } catch (error) {
    console.error(
      "Remove Wishlist Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message || "Server Error",
    });
  }
};

module.exports = {
  addToWishlist,
  getMyWishlist,
  getAdminWishlist,
  removeWishlist,
};