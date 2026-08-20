const Car = require("../models/Car");
const mongoose = require("mongoose");

// ======================================
// CONSTANTS
// ======================================

const VALID_AVAILABILITY = [
  "Stock",
  "Reserved",
  "Sold",
];

const VALID_STATUS = [
  "pending",
  "approved",
  "rejected",
];

// ======================================
// HELPER - NORMALIZE AVAILABILITY
// ======================================

const normalizeAvailability = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  const map = {
    stock: "Stock",
    "in stock": "Stock",
    available: "Stock",

    reserved: "Reserved",
    reserve: "Reserved",
    booked: "Reserved",

    sold: "Sold",
  };

  return map[normalized] || "";
};

// ======================================
// HELPER - NORMALIZE OWNER
// ======================================

const normalizeOwner = (value) => {
  const normalized = String(value || "")
    .trim()
    .toLowerCase();

  const ownerMap = {
    "1": "1st Owner",
    "2": "2nd Owners",
    "3": "3rd owner",
    "4": "4th Owners",

    "1st owner": "1st Owner",
    "1st owners": "1st Owner",

    "2nd owner": "2nd Owners",
    "2nd owners": "2nd Owners",

    "3rd owner": "3rd owner",
    "3rd owners": "3rd owner",

    "4th owner": "4th Owners",
    "4th owners": "4th Owners",
  };

  return (
    ownerMap[normalized] ||
    String(value || "").trim() ||
    "1st Owner"
  );
};

// ======================================
// ADD CAR
// SELLER
// ======================================

const addCar = async (req, res) => {
  try {
    const {
      sellerName,
      sellerEmail,
      brand,
      model,
      year,
      price,
      kilometers,
      fuelType,
      transmission,

      // Dynamic fields
      bodyType,
      color,
      seats,
      owners,
      hub,
      availability,
      carCategory,
      safetyFeatures,
      features,

      description,
      image,
      images,
      city,
    } = req.body;

    // ======================================
    // VALIDATE REQUIRED SELLER CAR FIELDS
    // ======================================

    const missingFields = [];

    if (!sellerName || !String(sellerName).trim()) {
      missingFields.push("sellerName");
    }

    if (!sellerEmail || !String(sellerEmail).trim()) {
      missingFields.push("sellerEmail");
    }

    if (!brand || !String(brand).trim()) {
      missingFields.push("brand");
    }

    if (!model || !String(model).trim()) {
      missingFields.push("model");
    }

    if (
      year === undefined ||
      year === null ||
      year === "" ||
      Number.isNaN(Number(year)) ||
      Number(year) <= 0
    ) {
      missingFields.push("year");
    }

    if (
      price === undefined ||
      price === null ||
      price === "" ||
      Number.isNaN(Number(price)) ||
      Number(price) <= 0
    ) {
      missingFields.push("price");
    }

    if (
      kilometers === undefined ||
      kilometers === null ||
      kilometers === "" ||
      Number.isNaN(Number(kilometers)) ||
      Number(kilometers) < 0
    ) {
      missingFields.push("kilometers");
    }

    if (!fuelType || !String(fuelType).trim()) {
      missingFields.push("fuelType");
    }

    if (
      !transmission ||
      !String(transmission).trim()
    ) {
      missingFields.push("transmission");
    }

    if (
      !description ||
      !String(description).trim()
    ) {
      missingFields.push("description");
    }

    // ======================================
    // RETURN EXACT MISSING FIELDS
    // ======================================

    if (missingFields.length > 0) {
      console.error(
        "❌ SELLER CAR VALIDATION FAILED"
      );

      console.error(
        "Missing fields:",
        missingFields
      );

      console.error(
        "Received values:",
        {
          sellerName,
          sellerEmail,
          brand,
          model,
          year,
          price,
          kilometers,
          fuelType,
          transmission,
          description,
        }
      );

      return res.status(400).json({
        success: false,

        message:
          "Please provide all required car fields.",

        missingFields,
      });
    }
    // ======================================
    // NORMALIZE AVAILABILITY
    // ======================================

    const finalAvailability =
      normalizeAvailability(
        availability
      ) || "Stock";

    // ======================================
    // NORMALIZE IMAGES
    // ======================================

    const carImages = {
      front:
        images?.front ||
        image ||
        "",

      back:
        images?.back ||
        "",

      left:
        images?.left ||
        "",

      right:
        images?.right ||
        "",
    };

    // ======================================
    // CREATE CAR
    // ======================================

    const car = await Car.create({
      sellerName:
        sellerName.trim(),

      sellerEmail:
        sellerEmail
          .trim()
          .toLowerCase(),

      brand:
        brand.trim(),

      model:
        model.trim(),

      year:
        Number(year),

      price:
        Number(price),

      kilometers:
        Number(kilometers),

      fuelType:
        fuelType.trim(),

      transmission:
        transmission.trim(),

      // ======================================
      // DYNAMIC FIELDS
      // ======================================

      bodyType:
        bodyType?.trim() || "",

      color:
        color?.trim() || "",

      seats:
        seats !== undefined &&
          seats !== ""
          ? Number(seats)
          : 5,

      owners:
        normalizeOwner(owners),

      hub:
        hub?.trim() || "",

      availability:
        finalAvailability,

      carCategory:
        carCategory?.trim() || "",

      safetyFeatures:
        Array.isArray(
          safetyFeatures
        )
          ? safetyFeatures
          : [],

      features:
        Array.isArray(features)
          ? features
          : [],

      description:
        description.trim(),

      // ======================================
      // EXISTING IMAGE COMPATIBILITY
      // ======================================

      image:
        carImages.front,

      // ======================================
      // FOUR IMAGES
      // ======================================

      images:
        carImages,

      // ======================================
      // LOCATION
      // ======================================

      city:
        city?.trim() || "",

      // ======================================
      // ADMIN
      // ======================================

      addedBy:
        "seller",

      status:
        "pending",

      featured:
        false,

      // Sync old stock field
      stock:
        finalAvailability ===
        "Stock",

      views:
        0,
    });

    console.log(
      "================================="
    );

    console.log(
      "✅ SELLER CAR SAVED"
    );

    console.log(
      "CAR ID:",
      car._id
    );

    console.log(
      "DYNAMIC DATA:",
      {
        bodyType:
          car.bodyType,

        color:
          car.color,

        seats:
          car.seats,

        owners:
          car.owners,

        hub:
          car.hub,

        availability:
          car.availability,

        carCategory:
          car.carCategory,

        safetyFeatures:
          car.safetyFeatures,

        features:
          car.features,
      }
    );

    console.log(
      "IMAGES:",
      car.images
    );

    console.log(
      "================================="
    );

    return res.status(201).json({
      success: true,

      message:
        "Car added successfully and sent for approval.",

      car,
    });
  } catch (error) {
    console.error(
      "❌ Add Car Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to add car.",
    });
  }
};

// ======================================
// ADMIN - ADD CAR
// ======================================

const addAdminCar = async (req, res) => {
  try {
    console.log(
      "================================="
    );

    console.log(
      "🚗 ADMIN ADD CAR REQUEST"
    );

    console.log(
      "BODY:",
      req.body
    );

    console.log(
      "DATABASE:",
      mongoose.connection.name
    );

    console.log(
      "COLLECTION:",
      Car.collection.name
    );

    console.log(
      "================================="
    );

    const {
      sellerName,
      sellerEmail,
      brand,
      model,
      year,
      price,
      kilometers,
      fuelType,
      transmission,

      // Dynamic fields
      bodyType,
      color,
      seats,
      owners,
      hub,
      availability,
      carCategory,
      safetyFeatures,
      features,

      description,
      image,
      images,
      city,

      featured,
    } = req.body;

    // ======================================
    // VALIDATION
    // ======================================

    if (
      !sellerName ||
      !sellerEmail ||
      !brand ||
      !model ||
      !year ||
      !price ||
      kilometers === undefined ||
      !fuelType ||
      !transmission ||
      !description
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Please fill all required car fields.",
      });
    }

    // ======================================
    // NORMALIZE AVAILABILITY
    // ======================================

    const finalAvailability =
      normalizeAvailability(
        availability
      ) || "Stock";

    // ======================================
    // NORMALIZE IMAGES
    // ======================================

    const carImages = {
      front:
        images?.front ||
        image ||
        "",

      back:
        images?.back ||
        "",

      left:
        images?.left ||
        "",

      right:
        images?.right ||
        "",
    };

    // ======================================
    // CREATE ADMIN CAR
    // ======================================

    const car = new Car({
      sellerName:
        sellerName.trim(),

      sellerEmail:
        sellerEmail
          .trim()
          .toLowerCase(),

      brand:
        brand.trim(),

      model:
        model.trim(),

      year:
        Number(year),

      price:
        Number(price),

      kilometers:
        Number(kilometers),

      fuelType:
        fuelType.trim(),

      transmission:
        transmission.trim(),

      // ======================================
      // DYNAMIC FILTER FIELDS
      // ======================================

      bodyType:
        bodyType?.trim() || "",

      color:
        color?.trim() || "",

      seats:
        seats !== undefined &&
          seats !== ""
          ? Number(seats)
          : 5,

      owners:
        normalizeOwner(owners),

      hub:
        hub?.trim() || "",

      availability:
        finalAvailability,

      carCategory:
        carCategory?.trim() || "",

      safetyFeatures:
        Array.isArray(
          safetyFeatures
        )
          ? safetyFeatures
          : [],

      features:
        Array.isArray(features)
          ? features
          : [],

      description:
        description.trim(),

      // ======================================
      // IMAGES
      // ======================================

      image:
        carImages.front,

      images:
        carImages,

      // ======================================
      // LOCATION
      // ======================================

      city:
        city?.trim() || "",

      // ======================================
      // ADMIN
      // ======================================

      addedBy:
        "admin",

      status:
        "approved",

      featured:
        featured !== undefined
          ? Boolean(featured)
          : true,

      // Keep stock synced
      stock:
        finalAvailability ===
        "Stock",

      views:
        0,
    });

    const savedCar =
      await car.save();

    console.log(
      "================================="
    );

    console.log(
      "✅ ADMIN CAR SAVED"
    );

    console.log(
      "CAR ID:",
      savedCar._id
    );

    console.log(
      "FILTER DATA:",
      {
        bodyType:
          savedCar.bodyType,

        color:
          savedCar.color,

        seats:
          savedCar.seats,

        owners:
          savedCar.owners,

        hub:
          savedCar.hub,

        availability:
          savedCar.availability,

        carCategory:
          savedCar.carCategory,

        safetyFeatures:
          savedCar.safetyFeatures,

        features:
          savedCar.features,
      }
    );

    console.log(
      "IMAGES:",
      savedCar.images
    );

    console.log(
      "================================="
    );

    return res.status(201).json({
      success: true,

      message:
        "Car added successfully",

      car:
        savedCar,
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ ADMIN ADD CAR ERROR"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to add car.",
    });
  }
};

// ======================================
// PUBLIC CARS
// APPROVED CARS ONLY
// ======================================

const getCars = async (
  req,
  res
) => {
  try {
    const query = {
      status:
        "approved",
    };

    if (
      req.query.city &&
      req.query.city !== "All"
    ) {
      query.city =
        req.query.city;
    }

    if (
      req.query.brand
    ) {
      query.brand =
        req.query.brand;
    }

    if (
      req.query.fuelType
    ) {
      query.fuelType =
        req.query.fuelType;
    }

    if (
      req.query.transmission
    ) {
      query.transmission =
        req.query.transmission;
    }

    if (
      req.query.year
    ) {
      query.year =
        Number(req.query.year);
    }

    const cars =
      await Car.find(query)
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        cars.length,

      cars,
    });
  } catch (error) {
    console.error(
      "Get Cars Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to load cars.",
    });
  }
};

// ======================================
// ADMIN - GET ALL CARS
// ======================================

const getAllCarsAdmin = async (
  req,
  res
) => {
  try {
    const cars =
      await Car.find()
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,

      count:
        cars.length,

      cars,
    });
  } catch (error) {
    console.error(
      "Admin Get Cars Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to load admin cars.",
    });
  }
};

// ======================================
// GET SINGLE CAR
// ======================================

const getCarById = async (
  req,
  res
) => {
  try {
    const id =
      req.params.id;

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid car ID.",
      });
    }

    const car =
      await Car.findById(id);

    if (!car) {
      return res.status(404).json({
        success: false,

        message:
          "Car not found.",
      });
    }

    return res.status(200).json({
      success: true,

      car,
    });
  } catch (error) {
    console.error(
      "Get Car By ID Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to load car.",
    });
  }
};

// ======================================
// UPDATE CAR STATUS
// ADMIN
//
// Handles:
// - approved / rejected / pending
// - featured
// - stock
// - availability
// ======================================

const updateCarStatus = async (
  req,
  res
) => {
  try {
    const {
      status,
      featured,
      stock,
      availability,
    } = req.body;

    const updateData = {};

    // ======================================
    // STATUS
    // ======================================

    if (
      status !== undefined
    ) {
      if (
        !VALID_STATUS.includes(
          status
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid car status.",
        });
      }

      updateData.status =
        status;
    }

    // ======================================
    // FEATURED
    // ======================================

    if (
      featured !== undefined
    ) {
      if (
        typeof featured ===
        "string"
      ) {
        updateData.featured =
          featured === "true";
      } else {
        updateData.featured =
          Boolean(featured);
      }
    }

    // ======================================
    // OLD STOCK CONTROL
    // ======================================

    if (
      stock !== undefined
    ) {
      if (
        typeof stock ===
        "string"
      ) {
        updateData.stock =
          stock === "true";
      } else {
        updateData.stock =
          Boolean(stock);
      }
    }

    // ======================================
    // NEW AVAILABILITY CONTROL
    //
    // Stock
    // Reserved
    // Sold
    // ======================================

    if (
      availability !== undefined
    ) {
      const finalAvailability =
        normalizeAvailability(
          availability
        );

      if (
        !VALID_AVAILABILITY.includes(
          finalAvailability
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid availability. Use Stock, Reserved, or Sold.",
        });
      }

      updateData.availability =
        finalAvailability;

      // IMPORTANT:
      // Keep old stock field synchronized
      updateData.stock =
        finalAvailability ===
        "Stock";
    }

    // ======================================
    // CHECK UPDATE
    // ======================================

    if (
      Object.keys(updateData)
        .length === 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "No valid fields provided for update.",
      });
    }

    // ======================================
    // UPDATE MONGODB
    // ======================================

    const car =
      await Car.findByIdAndUpdate(
        req.params.id,

        {
          $set:
            updateData,
        },

        {
          new: true,
          runValidators: true,
        }
      );

    if (!car) {
      return res.status(404).json({
        success: false,

        message:
          "Car not found.",
      });
    }

    console.log(
      "================================="
    );

    console.log(
      "✅ CAR STATUS UPDATED"
    );

    console.log(
      "CAR ID:",
      req.params.id
    );

    console.log(
      "UPDATED DATA:",
      updateData
    );

    console.log(
      "================================="
    );

    return res.status(200).json({
      success: true,

      message:
        "Car updated successfully.",

      car,
    });
  } catch (error) {
    console.error(
      "Update Car Status Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to update car.",
    });
  }
};

// ======================================
// UPDATE COMPLETE CAR
// ADMIN
// ======================================

const updateCar = async (
  req,
  res
) => {
  try {
    const {
      id,
    } = req.params;

    // ======================================
    // VALIDATE MONGODB ID
    // ======================================

    if (
      !mongoose.Types.ObjectId.isValid(
        id
      )
    ) {
      return res.status(400).json({
        success: false,

        message:
          "Invalid car ID.",
      });
    }

    // ======================================
    // ALLOWED FIELDS
    // ======================================

    const allowedFields = [
      "sellerName",
      "sellerEmail",
      "brand",
      "model",
      "year",
      "price",
      "kilometers",
      "fuelType",
      "transmission",

      // Dynamic fields
      "bodyType",
      "color",
      "seats",
      "owners",
      "hub",
      "availability",
      "carCategory",
      "safetyFeatures",
      "features",

      "description",
      "image",
      "images",
      "city",

      // Admin
      "status",
      "featured",
      "stock",
    ];

    // ======================================
    // BUILD UPDATE DATA
    // ======================================

    const updateData = {};

    allowedFields.forEach(
      (field) => {
        if (
          req.body[field] !==
          undefined
        ) {
          updateData[field] =
            req.body[field];
        }
      }
    );

    // ======================================
    // CHECK UPDATE DATA
    // ======================================

    if (
      Object.keys(updateData)
        .length === 0
    ) {
      return res.status(400).json({
        success: false,

        message:
          "No valid fields provided for update.",
      });
    }

    // ======================================
    // NORMALIZE STRING FIELDS
    // ======================================

    const stringFields = [
      "sellerName",
      "sellerEmail",
      "brand",
      "model",
      "fuelType",
      "transmission",
      "bodyType",
      "color",
      "hub",
      "availability",
      "carCategory",
      "description",
      "city",
      "image",
    ];

    stringFields.forEach(
      (field) => {
        if (
          updateData[field] !==
          undefined
        ) {
          updateData[field] =
            String(
              updateData[field]
            ).trim();
        }
      }
    );

    // ======================================
    // SELLER EMAIL LOWERCASE
    // ======================================

    if (
      updateData.sellerEmail
    ) {
      updateData.sellerEmail =
        updateData.sellerEmail
          .toLowerCase();
    }

    // ======================================
    // NUMBER FIELDS
    // IMPORTANT:
    // owners is NOT here because
    // owners is a STRING.
    // ======================================

    const numberFields = [
      "year",
      "price",
      "kilometers",
      "seats",
    ];

    for (
      const field of numberFields
    ) {
      if (
        updateData[field] !==
        undefined
      ) {
        const value =
          Number(
            updateData[field]
          );

        if (
          Number.isNaN(value)
        ) {
          return res.status(400).json({
            success: false,

            message:
              `${field} must be a valid number.`,
          });
        }

        updateData[field] =
          value;
      }
    }

    // ======================================
    // NORMALIZE OWNER
    // ======================================

    if (
      updateData.owners !==
      undefined
    ) {
      updateData.owners =
        normalizeOwner(
          updateData.owners
        );
    }

    // ======================================
    // NORMALIZE AVAILABILITY
    // ======================================

    if (
      updateData.availability !==
      undefined
    ) {
      const finalAvailability =
        normalizeAvailability(
          updateData.availability
        );

      if (
        !VALID_AVAILABILITY.includes(
          finalAvailability
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid availability. Use Stock, Reserved, or Sold.",
        });
      }

      updateData.availability =
        finalAvailability;

      // IMPORTANT
      // Synchronize old stock field
      updateData.stock =
        finalAvailability ===
        "Stock";
    }

    // ======================================
    // ARRAY FIELDS
    // ======================================

    if (
      updateData.safetyFeatures !==
      undefined
    ) {
      updateData.safetyFeatures =
        Array.isArray(
          updateData.safetyFeatures
        )
          ? updateData.safetyFeatures
          : [];
    }

    if (
      updateData.features !==
      undefined
    ) {
      updateData.features =
        Array.isArray(
          updateData.features
        )
          ? updateData.features
          : [];
    }

    // ======================================
    // VALIDATE STATUS
    // ======================================

    if (
      updateData.status !==
      undefined
    ) {
      if (
        !VALID_STATUS.includes(
          updateData.status
        )
      ) {
        return res.status(400).json({
          success: false,

          message:
            "Invalid car status.",
        });
      }
    }

    // ======================================
    // FEATURED BOOLEAN
    // ======================================

    if (
      updateData.featured !==
      undefined
    ) {
      if (
        typeof updateData.featured ===
        "string"
      ) {
        updateData.featured =
          updateData.featured ===
          "true";
      } else {
        updateData.featured =
          Boolean(
            updateData.featured
          );
      }
    }

    // ======================================
    // STOCK BOOLEAN
    //
    // If availability was supplied,
    // availability already controls stock.
    // Otherwise handle stock normally.
    // ======================================

    if (
      updateData.stock !==
      undefined
    ) {
      if (
        typeof updateData.stock ===
        "string"
      ) {
        updateData.stock =
          updateData.stock ===
          "true";
      } else {
        updateData.stock =
          Boolean(
            updateData.stock
          );
      }
    }

    // ======================================
    // IMAGE SYNC
    // ======================================

    if (
      updateData.images &&
      typeof updateData.images ===
      "object" &&
      updateData.images.front !==
      undefined
    ) {
      updateData.image =
        updateData.images.front ||
        "";
    }

    // ======================================
    // UPDATE MONGODB
    // ======================================

    const car =
      await Car.findByIdAndUpdate(
        id,

        {
          $set:
            updateData,
        },

        {
          new: true,
          runValidators: true,
        }
      );

    // ======================================
    // CAR NOT FOUND
    // ======================================

    if (!car) {
      return res.status(404).json({
        success: false,

        message:
          "Car not found.",
      });
    }

    // ======================================
    // LOG
    // ======================================

    console.log(
      "================================="
    );

    console.log(
      "✅ CAR UPDATED SUCCESSFULLY"
    );

    console.log(
      "CAR ID:",
      id
    );

    console.log(
      "UPDATED DATA:",
      updateData
    );

    console.log(
      "FINAL AVAILABILITY:",
      car.availability
    );

    console.log(
      "FINAL STOCK:",
      car.stock
    );

    console.log(
      "FINAL OWNER:",
      car.owners
    );

    console.log(
      "================================="
    );

    // ======================================
    // RESPONSE
    // ======================================

    return res.status(200).json({
      success: true,

      message:
        "Car details updated successfully.",

      car,
    });
  } catch (error) {
    console.error(
      "================================="
    );

    console.error(
      "❌ UPDATE CAR ERROR"
    );

    console.error(error);

    console.error(
      "================================="
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to update car.",
    });
  }
};

// ======================================
// DELETE CAR
// ======================================

const deleteCar = async (
  req,
  res
) => {
  try {
    const car =
      await Car.findByIdAndDelete(
        req.params.id
      );

    if (!car) {
      return res.status(404).json({
        success: false,

        message:
          "Car not found.",
      });
    }

    return res.status(200).json({
      success: true,

      message:
        "Car deleted successfully.",
    });
  } catch (error) {
    console.error(
      "Delete Car Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to delete car.",
    });
  }
};

// ======================================
// GET USER CARS
// ======================================

const getMyCars = async (
  req,
  res
) => {
  try {
    const email =
      req.params.email
        ?.trim()
        .toLowerCase();

    if (!email) {
      return res.status(400).json({
        success: false,

        message:
          "Seller email is required.",
      });
    }

    const cars =
      await Car.find({
        sellerEmail:
          email,
      }).sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,

      count:
        cars.length,

      cars,
    });
  } catch (error) {
    console.error(
      "Get My Cars Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Failed to load seller cars.",
    });
  }
};

// ======================================
// INCREMENT CAR VIEW COUNT
// ======================================

const incrementCarView =
  async (
    req,
    res
  ) => {
    try {
      const car =
        await Car.findByIdAndUpdate(
          req.params.id,

          {
            $inc: {
              views: 1,
            },
          },

          {
            new: true,
          }
        );

      if (!car) {
        return res.status(404).json({
          success: false,

          message:
            "Car not found.",
        });
      }

      return res.status(200).json({
        success: true,

        views:
          car.views,
      });
    } catch (error) {
      console.error(
        "Increment Car View Error:",
        error
      );

      return res.status(500).json({
        success: false,

        message:
          error.message ||
          "Failed to update car views.",
      });
    }
  };

// ======================================
// EXPORTS
// ======================================

module.exports = {
  addCar,
  addAdminCar,
  getCars,
  getAllCarsAdmin,
  getCarById,
  updateCarStatus,
  updateCar,
  deleteCar,
  getMyCars,
  incrementCarView,
};