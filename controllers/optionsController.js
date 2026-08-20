const FuelType = require("../models/FuelType");
const Transmission = require("../models/Transmission");
const CarOption = require("../models/CarOption");

// =====================================================
// HELPERS
// =====================================================

const normalizeCarOptionCategory = (category) => {
  const value = String(category || "").trim();

  if (value === "owner") {
    return "owners";
  }

  return value;
};

const escapeRegExp = (value) => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// =====================================================
// FUEL TYPES
// =====================================================

const getFuelTypes = async (req, res) => {
  try {
    const fuelTypes = await FuelType.find({
      active: true,
    }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: fuelTypes.length,
      fuelTypes,
    });
  } catch (error) {
    console.error("Get Fuel Types Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// TRANSMISSIONS
// =====================================================

const getTransmissions = async (req, res) => {
  try {
    const transmissions = await Transmission.find({
      active: true,
    }).sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: transmissions.length,
      transmissions,
    });
  } catch (error) {
    console.error("Get Transmissions Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN - ALL FUEL TYPES
// =====================================================

const getAllFuelTypesAdmin = async (req, res) => {
  try {
    const fuelTypes = await FuelType.find().sort({
      name: 1,
    });

    res.status(200).json({
      success: true,
      count: fuelTypes.length,
      fuelTypes,
    });
  } catch (error) {
    console.error("Get All Fuel Types Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CREATE FUEL TYPE
// =====================================================

const createFuelType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Fuel type name is required.",
      });
    }

    const cleanName = name.trim();

    const existing = await FuelType.findOne({
      name: new RegExp(
        `^${escapeRegExp(cleanName)}$`,
        "i"
      ),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "This fuel type already exists.",
      });
    }

    const fuelType = await FuelType.create({
      name: cleanName,
    });

    res.status(201).json({
      success: true,
      fuelType,
    });
  } catch (error) {
    console.error("Create Fuel Type Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE FUEL TYPE
// =====================================================

const updateFuelType = async (req, res) => {
  try {
    const { name, active } = req.body;

    const update = {};

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message: "Fuel type name cannot be empty.",
        });
      }

      update.name = cleanName;
    }

    if (active !== undefined) {
      update.active = Boolean(active);
    }

    const fuelType =
      await FuelType.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!fuelType) {
      return res.status(404).json({
        success: false,
        message: "Fuel type not found.",
      });
    }

    res.status(200).json({
      success: true,
      fuelType,
    });
  } catch (error) {
    console.error("Update Fuel Type Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE FUEL TYPE
// =====================================================

const deleteFuelType = async (req, res) => {
  try {
    const Car = require("../models/Car");

    const fuelType =
      await FuelType.findById(req.params.id);

    if (!fuelType) {
      return res.status(404).json({
        success: false,
        message: "Fuel type not found.",
      });
    }

    const carsUsingIt =
      await Car.countDocuments({
        fuelType: fuelType.name,
      });

    if (carsUsingIt > 0) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot delete - ${carsUsingIt} car(s) use this fuel type. Deactivate it instead.`,
      });
    }

    await fuelType.deleteOne();

    res.status(200).json({
      success: true,
      message: "Fuel type deleted.",
    });
  } catch (error) {
    console.error("Delete Fuel Type Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN - ALL TRANSMISSIONS
// =====================================================

const getAllTransmissionsAdmin = async (req, res) => {
  try {
    const transmissions =
      await Transmission.find().sort({
        name: 1,
      });

    res.status(200).json({
      success: true,
      count: transmissions.length,
      transmissions,
    });
  } catch (error) {
    console.error(
      "Get All Transmissions Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// CREATE TRANSMISSION
// =====================================================

const createTransmission = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Transmission name is required.",
      });
    }

    const cleanName = name.trim();

    const existing =
      await Transmission.findOne({
        name: new RegExp(
          `^${escapeRegExp(cleanName)}$`,
          "i"
        ),
      });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "This transmission already exists.",
      });
    }

    const transmission =
      await Transmission.create({
        name: cleanName,
      });

    res.status(201).json({
      success: true,
      transmission,
    });
  } catch (error) {
    console.error(
      "Create Transmission Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// UPDATE TRANSMISSION
// =====================================================

const updateTransmission = async (req, res) => {
  try {
    const { name, active } = req.body;

    const update = {};

    if (name !== undefined) {
      const cleanName = String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message:
            "Transmission name cannot be empty.",
        });
      }

      update.name = cleanName;
    }

    if (active !== undefined) {
      update.active = Boolean(active);
    }

    const transmission =
      await Transmission.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!transmission) {
      return res.status(404).json({
        success: false,
        message: "Transmission not found.",
      });
    }

    res.status(200).json({
      success: true,
      transmission,
    });
  } catch (error) {
    console.error(
      "Update Transmission Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// DELETE TRANSMISSION
// =====================================================

const deleteTransmission = async (req, res) => {
  try {
    const Car = require("../models/Car");

    const transmission =
      await Transmission.findById(
        req.params.id
      );

    if (!transmission) {
      return res.status(404).json({
        success: false,
        message:
          "Transmission not found.",
      });
    }

    const carsUsingIt =
      await Car.countDocuments({
        transmission:
          transmission.name,
      });

    if (carsUsingIt > 0) {
      return res.status(400).json({
        success: false,
        message:
          `Cannot delete - ${carsUsingIt} car(s) use this transmission. Deactivate it instead.`,
      });
    }

    await transmission.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Transmission deleted.",
    });
  } catch (error) {
    console.error(
      "Delete Transmission Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// PUBLIC - GET ACTIVE CAR OPTIONS
// =====================================================

const getCarOptions = async (req, res) => {
  try {
    const options =
      await CarOption.find({
        active: true,
      }).sort({
        category: 1,
        name: 1,
      });

    const normalizedOptions =
      options.map((option) => {
        const item = option.toObject();

        if (item.category === "owner") {
          item.category = "owners";
        }

        return item;
      });

    const grouped = {};

    normalizedOptions.forEach((option) => {
      if (!grouped[option.category]) {
        grouped[option.category] = [];
      }

      grouped[option.category].push(option);
    });

    res.status(200).json({
      success: true,
      count: normalizedOptions.length,

      // Current frontend compatibility
      options: normalizedOptions,

      // Existing BuyCars compatibility
      carOptions: normalizedOptions,

      grouped,
    });
  } catch (error) {
    console.error(
      "Get Car Options Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN - GET ALL CAR OPTIONS
// =====================================================

const getAllCarOptionsAdmin = async (
  req,
  res
) => {
  try {
    const options =
      await CarOption.find().sort({
        category: 1,
        name: 1,
      });

    const normalizedOptions =
      options.map((option) => {
        const item = option.toObject();

        if (item.category === "owner") {
          item.category = "owners";
        }

        return item;
      });

    res.status(200).json({
      success: true,
      count: normalizedOptions.length,
      options: normalizedOptions,
      carOptions: normalizedOptions,
    });
  } catch (error) {
    console.error(
      "Get All Car Options Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// ADMIN - CREATE CAR OPTION
// =====================================================

const createCarOption = async (req, res) => {
  try {
    const rawCategory = req.body.category;
    const rawName = req.body.name;

    const category =
      normalizeCarOptionCategory(
        rawCategory
      );

    const name =
      typeof rawName === "string"
        ? rawName.trim()
        : "";

    const allowedCategories = [
      "bodyType",
      "color",
      "seats",
      "owners",
      "hub",
      "availability",
      "carCategory",
      "safetyFeatures",
      "features",
    ];

    if (
      !allowedCategories.includes(category)
    ) {
      return res.status(400).json({
        success: false,
        message:
          `Invalid car option category "${rawCategory}". Allowed categories: ${allowedCategories.join(", ")}.`,
      });
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message:
          "Category and option name are required.",
      });
    }

    const existing =
      await CarOption.findOne({
        category: {
          $in:
            category === "owners"
              ? ["owners", "owner"]
              : [category],
        },

        name: new RegExp(
          `^${escapeRegExp(name)}$`,
          "i"
        ),
      });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "This option already exists.",
      });
    }

    const option =
      await CarOption.create({
        category,
        name,
      });

    res.status(201).json({
      success: true,
      option,
    });
  } catch (error) {
    console.error(
      "Create Car Option Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.name === "ValidationError"
          ? `CarOption validation failed: ${Object.values(
              error.errors
            )
              .map(
                (item) =>
                  item.message
              )
              .join(", ")}`
          : error.message,
    });
  }
};

// =====================================================
// ADMIN - UPDATE CAR OPTION
// =====================================================

const updateCarOption = async (
  req,
  res
) => {
  try {
    const { name, active } =
      req.body;

    const update = {};

    if (name !== undefined) {
      const cleanName =
        String(name).trim();

      if (!cleanName) {
        return res.status(400).json({
          success: false,
          message:
            "Option name cannot be empty.",
        });
      }

      update.name = cleanName;
    }

    if (active !== undefined) {
      update.active = Boolean(active);
    }

    const option =
      await CarOption.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!option) {
      return res.status(404).json({
        success: false,
        message:
          "Option not found.",
      });
    }

    const result = option.toObject();

    if (result.category === "owner") {
      result.category = "owners";
    }

    res.status(200).json({
      success: true,
      option: result,
    });
  } catch (error) {
    console.error(
      "Update Car Option Error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.name === "ValidationError"
          ? `CarOption validation failed: ${Object.values(
              error.errors
            )
              .map(
                (item) =>
                  item.message
              )
              .join(", ")}`
          : error.message,
    });
  }
};

// =====================================================
// ADMIN - DELETE CAR OPTION
// =====================================================

const deleteCarOption = async (
  req,
  res
) => {
  try {
    const option =
      await CarOption.findById(
        req.params.id
      );

    if (!option) {
      return res.status(404).json({
        success: false,
        message:
          "Option not found.",
      });
    }

    await option.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Option deleted.",
    });
  } catch (error) {
    console.error(
      "Delete Car Option Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================================
// EXPORTS
// =====================================================

module.exports = {
  getFuelTypes,
  getTransmissions,

  getAllFuelTypesAdmin,
  createFuelType,
  updateFuelType,
  deleteFuelType,

  getAllTransmissionsAdmin,
  createTransmission,
  updateTransmission,
  deleteTransmission,

  getCarOptions,
  getAllCarOptionsAdmin,
  createCarOption,
  updateCarOption,
  deleteCarOption,
};