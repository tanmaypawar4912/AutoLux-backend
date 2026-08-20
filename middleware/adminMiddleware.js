const { getAuth } = require("@clerk/express");

// ======================================
// ADMIN AUTH MIDDLEWARE
// ======================================

const adminMiddleware = (req, res, next) => {
  try {
    const auth = getAuth(req);

    console.log("=================================");
    console.log("🔐 ADMIN AUTH CHECK");
    console.log(
      "METHOD:",
      req.method
    );
    console.log(
      "URL:",
      req.originalUrl
    );
    console.log(
      "Authorization:",
      req.headers.authorization
        ? "TOKEN PRESENT"
        : "NO TOKEN"
    );
    console.log(
      "IS AUTHENTICATED:",
      auth?.isAuthenticated
    );
    console.log(
      "AUTH USER ID:",
      auth?.userId
    );
    console.log(
      "ADMIN ENV ID:",
      process.env.ADMIN_USER_ID
    );
    console.log("=================================");

    // ======================================
    // CHECK LOGIN
    // ======================================

    if (
      !auth ||
      !auth.userId
    ) {
      return res.status(401).json({
        success: false,
        message: "Please login first.",
      });
    }

    // ======================================
    // CHECK ADMIN
    // ======================================

    const adminUserId =
      process.env.ADMIN_USER_ID?.trim();

    if (!adminUserId) {
      console.error(
        "❌ ADMIN_USER_ID is missing in .env"
      );

      return res.status(500).json({
        success: false,
        message:
          "Admin configuration is missing.",
      });
    }

    if (
      auth.userId.trim() !==
      adminUserId
    ) {
      console.log(
        "❌ ADMIN ACCESS DENIED"
      );

      return res.status(403).json({
        success: false,
        message:
          "Only Admin can access this resource.",
      });
    }

    // ======================================
    // ADMIN VERIFIED
    // ======================================

    console.log(
      "✅ ADMIN VERIFIED"
    );

    next();

  } catch (error) {
    console.error(
      "❌ Admin Middleware Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
};

module.exports = adminMiddleware;