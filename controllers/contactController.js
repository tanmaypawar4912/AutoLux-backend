const Contact = require("../models/Contact");

const SUBJECTS = [
  "General Inquiry",
  "Car Information",
  "Book a Test Drive",
  "Sell My Car",
  "Car Financing / EMI",
  "Booking Related",
  "Website / Technical Issue",
  "Complaint",
  "Feedback / Suggestion",
  "Other",
];

const STATUSES = [
  "New",
  "In Progress",
  "Resolved",
  "Closed",
];

const PRIORITIES = [
  "Low",
  "Normal",
  "High",
];

const addContact = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      interestedCar = "",
      preferredContact = "Any",
      message,
    } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !subject ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email, phone, subject and message are required.",
      });
    }

    if (!SUBJECTS.includes(subject)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact subject.",
      });
    }

    const allowedContactMethods = [
      "Email",
      "Phone",
      "WhatsApp",
      "Any",
    ];

    if (!allowedContactMethods.includes(preferredContact)) {
      return res.status(400).json({
        success: false,
        message: "Invalid preferred contact method.",
      });
    }

    const contact = await Contact.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      subject,
      interestedCar: interestedCar?.trim() || "",
      preferredContact,
      message: message.trim(),
      status: "New",
      priority: "Normal",
      clerkUserId: req.auth?.userId || "",
    });

    return res.status(201).json({
      success: true,
      message: "Contact message sent successfully.",
      contact,
    });
  } catch (error) {
    console.error("Add Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to send contact message.",
    });
  }
};

const getAdminContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    const stats = {
      total: contacts.length,
      new: contacts.filter((item) => item.status === "New").length,
      inProgress: contacts.filter(
        (item) => item.status === "In Progress"
      ).length,
      resolved: contacts.filter(
        (item) => item.status === "Resolved"
      ).length,
      highPriority: contacts.filter(
        (item) => item.priority === "High"
      ).length,
    };

    return res.status(200).json({
      success: true,
      count: contacts.length,
      stats,
      contacts,
    });
  } catch (error) {
    console.error("Get Admin Contacts Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contact messages.",
    });
  }
};

const updateContact = async (req, res) => {
  try {
    const { status, priority } = req.body;

    if (status && !STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact status.",
      });
    }

    if (priority && !PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid contact priority.",
      });
    }

    const update = {};
    if (status) update.status = status;
    if (priority) update.priority = priority;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nothing to update.",
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      update,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message updated successfully.",
      contact,
    });
  } catch (error) {
    console.error("Update Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update contact message.",
    });
  }
};

const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact message not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact message deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Contact Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete contact message.",
    });
  }
};

module.exports = {
  addContact,
  getAdminContacts,
  updateContact,
  deleteContact,
};
