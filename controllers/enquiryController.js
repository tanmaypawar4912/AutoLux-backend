const Enquiry = require("../models/Enquiry");

// ======================================
// ADD ENQUIRY
// ======================================

const addEnquiry = async (req, res) => {
  try {
    const {
      carId,
      carBrand,
      carModel,
      sellerEmail,
      name,
      email,
      message,
    } = req.body;

    if (
      !carId ||
      !carBrand ||
      !carModel ||
      !sellerEmail ||
      !name ||
      !email ||
      !message
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const enquiry = await Enquiry.create({
      carId,
      carBrand,
      carModel,
      sellerEmail,
      name,
      email,
      message,
      status: "New",
    });

    res.status(201).json({
      success: true,
      message: "Enquiry sent successfully",
      enquiry,
    });
  } catch (error) {
    console.error(
      "Add Enquiry Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ENQUIRIES FOR A CAR
// ======================================

const getEnquiriesForCar = async (
  req,
  res
) => {
  try {
    const enquiries =
      await Enquiry.find({
        carId: req.params.carId,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error(
      "Get Car Enquiries Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ENQUIRIES FOR SELLER
// ======================================

const getEnquiriesForSeller = async (
  req,
  res
) => {
  try {
    const enquiries =
      await Enquiry.find({
        sellerEmail: req.params.email,
      }).sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      enquiries,
    });
  } catch (error) {
    console.error(
      "Get Seller Enquiries Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================
// GET ALL ENQUIRIES
// ADMIN
// ======================================

const getAdminEnquiries = async (
  req,
  res
) => {
  try {
    const enquiries =
      await Enquiry.find()
        .populate(
          "carId",
          "brand model year price image"
        )
        .sort({
          createdAt: -1,
        });

    const total = enquiries.length;

    const newEnquiries =
      enquiries.filter(
        (enquiry) =>
          enquiry.status === "New"
      ).length;

    const respondedEnquiries =
      enquiries.filter(
        (enquiry) =>
          enquiry.status ===
          "Responded"
      ).length;

    res.status(200).json({
      success: true,

      count: total,

      stats: {
        total,
        new: newEnquiries,
        responded:
          respondedEnquiries,
      },

      enquiries,
    });
  } catch (error) {
    console.error(
      "Get Admin Enquiries Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to fetch enquiries",
    });
  }
};

// ======================================
// UPDATE ENQUIRY STATUS
// ADMIN
// ======================================

const updateEnquiryStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
    } = req.body;

    if (
      !["New", "Responded"].includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid enquiry status",
      });
    }

    const enquiry =
      await Enquiry.findByIdAndUpdate(
        req.params.id,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Enquiry status updated",
      enquiry,
    });
  } catch (error) {
    console.error(
      "Update Enquiry Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to update enquiry",
    });
  }
};

// ======================================
// DELETE ENQUIRY
// ADMIN
// ======================================

const deleteEnquiry = async (
  req,
  res
) => {
  try {
    const enquiry =
      await Enquiry.findByIdAndDelete(
        req.params.id
      );

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Enquiry deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Enquiry Error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to delete enquiry",
    });
  }
};

// ======================================
// EXPORTS
// ======================================

module.exports = {
  addEnquiry,
  getEnquiriesForCar,
  getEnquiriesForSeller,
  getAdminEnquiries,
  updateEnquiryStatus,
  deleteEnquiry,
};