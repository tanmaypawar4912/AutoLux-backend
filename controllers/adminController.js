const Car = require("../models/Car");
const Booking = require("../models/Booking");

// ======================================
// GET ADMIN DASHBOARD STATS
// ======================================

const getDashboardStats = async (req, res) => {
  try {
    // ===============================
    // CAR STATISTICS
    // ===============================

    const totalCars =
      await Car.countDocuments();

    const pendingCars =
      await Car.countDocuments({
        status: "pending",
      });

    const approvedCars =
      await Car.countDocuments({
        status: "approved",
      });

    const rejectedCars =
      await Car.countDocuments({
        status: "rejected",
      });

    // ===============================
    // BOOKING STATISTICS
    // ===============================

    const totalBookings =
      await Booking.countDocuments();

    const pendingBookings =
      await Booking.countDocuments({
        status: "pending",
      });

    const approvedBookings =
      await Booking.countDocuments({
        status: "approved",
      });

    const completedBookings =
      await Booking.countDocuments({
        status: "completed",
      });

    const rejectedBookings =
      await Booking.countDocuments({
        status: {
          $in: ["rejected", "cancelled"],
        },
      });

    // ===============================
    // RECENT CARS
    // ===============================

    const recentCars =
      await Car.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "brand model year price status image createdAt"
        );

    // ===============================
    // RESPONSE
    // ===============================

    res.status(200).json({
      success: true,

      stats: {
        cars: {
          total: totalCars,
          pending: pendingCars,
          approved: approvedCars,
          rejected: rejectedCars,
        },

        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
          completed: completedBookings,
          rejected: rejectedBookings,
        },
      },

      recentCars,
    });
  } catch (error) {
    console.error(
      "Admin Dashboard Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load dashboard statistics",
    });
  }
};

// ======================================
// GET DYNAMIC CAR FILTERS
// ======================================

const getCarFilters = async (req, res) => {
  try {
    const [
      brands,
      fuelTypes,
      transmissions,
      years,
    ] = await Promise.all([
      Car.distinct("brand"),
      Car.distinct("fuelType"),
      Car.distinct("transmission"),
      Car.distinct("year"),
    ]);

    res.status(200).json({
      success: true,

      filters: {
        brands: brands
          .filter(Boolean)
          .sort(),

        fuelTypes: fuelTypes
          .filter(Boolean)
          .sort(),

        transmissions: transmissions
          .filter(Boolean)
          .sort(),

        years: years
          .filter(Boolean)
          .sort((a, b) => b - a),
      },
    });
  } catch (error) {
    console.error(
      "Car Filters Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load car filters",
    });
  }
};

// ======================================
// GET ALL CLERK USERS
// ======================================

const getAllUsers = async (req, res) => {
  try {
    const { clerkClient } =
      require("@clerk/express");

    const result =
      await clerkClient.users.getUserList({
        limit: 100,
        orderBy: "-created_at",
      });

    const users = result.data.map(
      (user) => {
        const primaryEmail =
          user.emailAddresses?.find(
            (email) =>
              email.id ===
              user.primaryEmailAddressId
          );

        return {
          id: user.id,

          firstName:
            user.firstName || "",

          lastName:
            user.lastName || "",

          fullName:
            [
              user.firstName,
              user.lastName,
            ]
              .filter(Boolean)
              .join(" ") || "User",

          email:
            primaryEmail?.emailAddress ||
            user.emailAddresses?.[0]
              ?.emailAddress ||
            "Email not available",

          imageUrl:
            user.imageUrl || "",

          role:
            user.publicMetadata?.role ||
            "user",

          createdAt:
            user.createdAt,

          updatedAt:
            user.updatedAt,

          banned:
            user.banned || false,
        };
      }
    );

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    console.error(
      "Get All Users Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to load users",
    });
  }
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  getDashboardStats,
  getCarFilters,
  getAllUsers,
};