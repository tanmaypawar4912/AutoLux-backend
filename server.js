const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { clerkMiddleware } = require("@clerk/express");

dotenv.config();

const connectDB = require("./config/db");

// ======================================
// ROUTES
// ======================================

const carRoutes = require("./routes/carRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const optionsRoutes = require("./routes/optionsRoutes");

const app = express();

// ======================================
// CORS
// MUST BE BEFORE CLERK
// ======================================
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://auto-lux-frontend.vercel.app",
    ],
    credentials: true,
    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);

// ======================================
// JSON
// ======================================

app.use(express.json());

// ======================================
// CLERK
// MUST BE BEFORE PROTECTED ROUTES
// ======================================

app.use(
  clerkMiddleware({
    authorizedParties: [
      "http://localhost:5173",
      "http://localhost:5174",
      "https://auto-lux-frontend.vercel.app",
    ],
  })
);

// ======================================
// DATABASE
// ======================================

connectDB();

// ======================================
// TEST ROUTE
// ======================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Car Dealership Backend API is Running 🚗🔥",
  });
});

// ======================================
// API ROUTES
// ======================================

app.use(
  "/api/cars",
  carRoutes
);

app.use(
  "/api/bookings",
  bookingRoutes
);

app.use(
  "/api/wishlist",
  wishlistRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/enquiries",
  enquiryRoutes
);

app.use(
  "/api/admin",
  adminRoutes
);

app.use(
  "/api/users",
  userRoutes
);

app.use(
  "/api/options",
  optionsRoutes
);

// ======================================
// 404 HANDLER
// ======================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// ======================================
// GLOBAL ERROR HANDLER
// ======================================

app.use(
  (error, req, res, next) => {
    console.error(
      "Global Server Error:",
      error
    );

    if (res.headersSent) {
      return next(error);
    }

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal Server Error",
    });
  }
);

// ======================================
// SERVER
// ======================================

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `🚀 Server running on port ${PORT}`
    );

    console.log(
      `🌐 API: http://localhost:${PORT}`
    );

    console.log(
      "🔐 Clerk authentication enabled"
    );

    console.log(
      "🗄️ MongoDB API ready"
    );
  }
);