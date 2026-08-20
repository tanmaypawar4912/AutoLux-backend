const mongoose = require("mongoose");
require("dotenv").config();

const Car = require("./models/Car");
const CarOption = require("./models/CarOption");

const MONGO_URI = process.env.MONGO_URI;

// =====================================================
// NORMALIZE
// =====================================================

const normalize = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();


// =====================================================
// GET OPTION NAME
// =====================================================

const getOptionName = (options, category) => {
  const item = options.find(
    (option) =>
      normalize(option.category) === normalize(category) &&
      option.active === true
  );

  return item ? item.name : "";
};


// =====================================================
// GET NUMERIC OPTION
// Example:
// "5 Seats"  -> 5
// "1st Owner" -> 1
// =====================================================

const getNumericOption = (
  options,
  category,
  fallback
) => {
  const name = getOptionName(
    options,
    category
  );

  const match = String(name).match(/\d+/);

  return match
    ? Number(match[0])
    : fallback;
};


// =====================================================
// FIND OPTION BY KEYWORDS
// =====================================================

const findOptionByKeywords = (
  options,
  category,
  keywords,
  fallback = ""
) => {
  const categoryOptions =
    options.filter(
      (option) =>
        normalize(option.category) ===
          normalize(category) &&
        option.active === true
    );

  for (const keyword of keywords) {
    const found =
      categoryOptions.find(
        (option) =>
          normalize(option.name).includes(
            normalize(keyword)
          )
      );

    if (found) {
      return found.name;
    }
  }

  return categoryOptions.length
    ? categoryOptions[0].name
    : fallback;
};


// =====================================================
// FIND AVAILABILITY OPTION
//
// Supports:
// Stock
// In Stock
// Available
// Reserved
// Booked
// Sold
// Out of Stock
// =====================================================

const findAvailabilityOption = (
  options,
  type
) => {
  const availabilityOptions =
    options.filter(
      (option) =>
        normalize(option.category) ===
          "availability" &&
        option.active === true
    );

  if (!availabilityOptions.length) {
    return "";
  }

  let keywords = [];

  switch (type) {
    case "stock":
      keywords = [
        "stock",
        "in stock",
        "available",
        "availability",
      ];
      break;

    case "reserved":
      keywords = [
        "reserved",
        "booked",
        "booking",
        "reserve",
      ];
      break;

    case "sold":
      keywords = [
        "sold",
        "sale",
      ];
      break;

    default:
      keywords = [];
  }

  for (const keyword of keywords) {
    const found =
      availabilityOptions.find(
        (option) =>
          normalize(option.name).includes(
            normalize(keyword)
          )
      );

    if (found) {
      return found.name;
    }
  }

  return "";
};


// =====================================================
// NORMALIZE EXISTING AVAILABILITY
// =====================================================

const normalizeAvailability = (
  availability
) => {
  const value = normalize(
    availability
  );

  if (
    value === "stock" ||
    value === "in stock" ||
    value === "available" ||
    value === "availability"
  ) {
    return "stock";
  }

  if (
    value === "reserved" ||
    value === "booked" ||
    value === "booking" ||
    value === "reserve"
  ) {
    return "reserved";
  }

  if (
    value === "sold" ||
    value === "sale"
  ) {
    return "sold";
  }

  return "";
};


// =====================================================
// MIGRATE CARS
// =====================================================

const migrateCars = async () => {
  try {
    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "AutoLux Car Migration Started"
    );
    console.log(
      "======================================"
    );
    console.log("");


    // =================================================
    // CHECK MONGO URI
    // =================================================

    if (!MONGO_URI) {
      throw new Error(
        "MONGO_URI is missing in .env"
      );
    }


    // =================================================
    // CONNECT MONGODB
    // =================================================

    await mongoose.connect(
      MONGO_URI
    );

    console.log(
      "MongoDB connected."
    );
    console.log("");


    // =================================================
    // LOAD ACTIVE CAR OPTIONS
    // =================================================

    const options =
      await CarOption.find({
        active: true,
      }).lean();

    console.log(
      `Active Car Options Found: ${options.length}`
    );


    if (!options.length) {
      throw new Error(
        "No active car options found in car_options collection."
      );
    }


    // =================================================
    // DISPLAY AVAILABLE OPTIONS
    // =================================================

    console.log("");
    console.log(
      "Available Admin Options:"
    );

    const optionCategories = [
      "bodyType",
      "color",
      "seats",
      "owners",
      "hub",
      "availability",
      "carCategory",
    ];

    for (
      const category of optionCategories
    ) {
      const categoryOptions =
        options.filter(
          (option) =>
            normalize(
              option.category
            ) ===
            normalize(category)
        );

      if (categoryOptions.length) {
        console.log(
          `${category}:`,
          categoryOptions.map(
            (option) =>
              option.name
          )
        );
      }
    }

    console.log("");


    // =================================================
    // LOAD ALL CARS
    // =================================================

    const cars =
      await Car.find({});

    console.log(
      `Total Cars Found: ${cars.length}`
    );

    console.log("");


    let updated = 0;
    let skipped = 0;


    // =================================================
    // MIGRATE EACH CAR
    // =================================================

    for (const car of cars) {
      const update = {};


      // =================================================
      // BODY TYPE
      // =================================================

      if (!car.bodyType) {
        const model =
          normalize(car.model);

        let bodyType = "";


        // HATCHBACK
        if (
          model.includes("swift") ||
          model.includes("wagon") ||
          model.includes("i10") ||
          model.includes("i20") ||
          model.includes("baleno") ||
          model.includes("alto") ||
          model.includes("nano")
        ) {
          bodyType =
            findOptionByKeywords(
              options,
              "bodyType",
              [
                "hatchback",
                "hatch",
              ],
              ""
            );
        }


        // SUV
        else if (
          model.includes("x5") ||
          model.includes("q5") ||
          model.includes("q8") ||
          model.includes("compass") ||
          model.includes("glc") ||
          model.includes("creta") ||
          model.includes("seltos") ||
          model.includes("venue")
        ) {
          bodyType =
            findOptionByKeywords(
              options,
              "bodyType",
              ["suv"],
              ""
            );
        }


        // DEFAULT
        else {
          bodyType =
            findOptionByKeywords(
              options,
              "bodyType",
              [
                "sedan",
                "suv",
                "hatchback",
              ],
              ""
            );
        }


        if (bodyType) {
          update.bodyType =
            bodyType;
        }
      }


      // =================================================
      // COLOR
      // =================================================

      if (!car.color) {
        const color =
          findOptionByKeywords(
            options,
            "color",
            [
              "black",
              "white",
              "grey",
              "gray",
              "silver",
              "red",
              "blue",
            ],
            ""
          );


        if (color) {
          update.color =
            color;
        }
      }


      // =================================================
      // SEATS
      // =================================================

      if (
        car.seats === undefined ||
        car.seats === null ||
        Number(car.seats) <= 0
      ) {
        const seats =
          getNumericOption(
            options,
            "seats",
            5
          );

        update.seats =
          seats;
      }


      // =================================================
      // OWNERS
      // =================================================

      if (
        car.owners === undefined ||
        car.owners === null ||
        Number(car.owners) <= 0
      ) {
        const owners =
          getNumericOption(
            options,
            "owners",
            1
          );

        update.owners =
          owners;
      }


      // =================================================
      // HUB
      // =================================================

      if (!car.hub) {
        const hub =
          getOptionName(
            options,
            "hub"
          );

        if (hub) {
          update.hub =
            hub;
        }
      }


      // =================================================
      // AVAILABILITY
      // =================================================

      const currentAvailability =
        normalizeAvailability(
          car.availability
        );


      // -----------------------------------------------
      // EXISTING AVAILABILITY IS VALID
      // -----------------------------------------------

      if (currentAvailability) {
        const availability =
          findAvailabilityOption(
            options,
            currentAvailability
          );

        if (availability) {
          update.availability =
            availability;
        }


        // Sync old stock boolean
        if (
          currentAvailability ===
          "stock"
        ) {
          update.stock = true;
        } else {
          update.stock = false;
        }
      }


      // -----------------------------------------------
      // AVAILABILITY IS EMPTY
      // -----------------------------------------------

      else {
        let availabilityType =
          "stock";


        // Old stock field decides
        // the initial availability

        if (
          car.stock === false
        ) {
          availabilityType =
            "reserved";
        }


        const availability =
          findAvailabilityOption(
            options,
            availabilityType
          );


        if (availability) {
          update.availability =
            availability;
        }


        update.stock =
          availabilityType ===
          "stock";
      }


      // =================================================
      // CAR CATEGORY
      // =================================================

      if (!car.carCategory) {
        const category =
          getOptionName(
            options,
            "carCategory"
          );

        if (category) {
          update.carCategory =
            category;
        }
      }


      // =================================================
      // SAFETY FEATURES
      // =================================================

      if (
        !Array.isArray(
          car.safetyFeatures
        ) ||
        car.safetyFeatures.length === 0
      ) {
        const safetyOptions =
          options.filter(
            (option) =>
              normalize(
                option.category
              ) ===
                "safetyfeatures" &&
              option.active === true
          );


        update.safetyFeatures =
          safetyOptions
            .slice(0, 2)
            .map(
              (option) =>
                option.name
            );
      }


      // =================================================
      // FEATURES
      // =================================================

      if (
        !Array.isArray(
          car.features
        ) ||
        car.features.length === 0
      ) {
        const featureOptions =
          options.filter(
            (option) =>
              normalize(
                option.category
              ) ===
                "features" &&
              option.active === true
          );


        update.features =
          featureOptions
            .slice(0, 3)
            .map(
              (option) =>
                option.name
            );
      }


      // =================================================
      // CITY
      //
      // If city is missing and hub exists,
      // do NOT blindly copy hub.
      // Hub and City are separate fields.
      // =================================================

      if (
        car.city === undefined ||
        car.city === null
      ) {
        update.city = "";
      }


      // =================================================
      // UPDATE CAR
      // =================================================

      if (
        Object.keys(update).length > 0
      ) {
        await Car.updateOne(
          {
            _id: car._id,
          },
          {
            $set: update,
          }
        );


        updated++;


        console.log(
          "--------------------------------------"
        );

        console.log(
          `Updated: ${car.brand} ${car.model}`
        );

        console.log(
          "Fields:",
          Object.keys(update)
        );


        if (
          update.availability
        ) {
          console.log(
            "Availability:",
            update.availability
          );
        }


        if (
          update.stock !==
          undefined
        ) {
          console.log(
            "Stock:",
            update.stock
          );
        }
      } else {
        skipped++;

        console.log(
          `Skipped: ${car.brand} ${car.model}`
        );
      }
    }


    // =================================================
    // FINAL RESULT
    // =================================================

    console.log("");
    console.log(
      "======================================"
    );

    console.log(
      `Cars Updated : ${updated}`
    );

    console.log(
      `Cars Skipped : ${skipped}`
    );

    console.log(
      `Total Cars   : ${cars.length}`
    );

    console.log(
      "======================================"
    );

    console.log("");
    console.log(
      "Car migration completed successfully."
    );
    console.log("");
  } catch (error) {
    console.error("");
    console.error(
      "======================================"
    );

    console.error(
      "CAR MIGRATION ERROR:"
    );

    console.error(error);

    console.error(
      "======================================"
    );

    console.error("");
  } finally {
    await mongoose.connection.close();

    console.log(
      "MongoDB connection closed."
    );
  }
};


// =====================================================
// START MIGRATION
// =====================================================

migrateCars();