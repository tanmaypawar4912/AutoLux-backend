const { clerkClient, getAuth } = require("@clerk/express");
const User = require("../models/User");

// ======================================
// SYNC CLERK USER TO MONGODB
// ======================================

const syncUser = async (req, res) => {
  try {
    const auth = getAuth(req);
    const userId = auth?.userId;

    console.log("=================================");
    console.log("SYNC USER");
    console.log("AUTH USER ID:", userId);
    console.log("=================================");

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    const clerkUser =
      await clerkClient.users.getUser(userId);

    const primaryEmail =
      clerkUser.emailAddresses?.find(
        (email) =>
          email.id ===
          clerkUser.primaryEmailAddressId
      );

    const email =
      primaryEmail?.emailAddress ||
      clerkUser.emailAddresses?.[0]
        ?.emailAddress;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "User email not found.",
      });
    }

    const fullName =
      [
        clerkUser.firstName,
        clerkUser.lastName,
      ]
        .filter(Boolean)
        .join(" ") || "User";

    const user =
      await User.findOneAndUpdate(
        {
          clerkId: userId,
        },
        {
          clerkId: userId,
          firstName:
            clerkUser.firstName || "",
          lastName:
            clerkUser.lastName || "",
          fullName,
          email:
            email.toLowerCase().trim(),
          image:
            clerkUser.imageUrl || "",
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        }
      );

    console.log(
      "✅ USER SYNCED:",
      user._id
    );

    return res.status(200).json({
      success: true,
      message:
        "User synced successfully.",
      user,
    });
  } catch (error) {
    console.error(
      "❌ SYNC USER ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error?.message ||
        "Failed to sync user.",
    });
  }
};

module.exports = {
  syncUser,
};