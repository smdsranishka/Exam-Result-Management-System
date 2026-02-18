const User = require("../models/userModel");
const Faculty = require("../models/facultyModel");
const bcrypt = require("bcryptjs");

exports.createAdmin = async (req, res) => {
  try {
    const { username, password, facultyId } = req.body;
    if (!username || !password || !facultyId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.createAdmin(username, hashedPassword, facultyId);
    res
      .status(201)
      .json({ success: true, message: "Admin created successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createAccessKey = async (req, res) => {
  try {
    const { keyValue, facultyId } = req.body;
    if (!keyValue || !facultyId) {
      return res
        .status(400)
        .json({ success: false, message: "Key and Faculty ID are required" });
    }

    await Faculty.createAccessKey(keyValue, facultyId, req.user.id);
    res
      .status(201)
      .json({ success: true, message: "Access key generated successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.getAllAdmins();
    res.json({ success: true, admins });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAccessKeys = async (req, res) => {
  try {
    const keys = await Faculty.getAccessKeys();
    res.json({ success: true, keys });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteAccessKey = async (req, res) => {
  try {
    await Faculty.deleteAccessKey(req.params.id);
    res.json({ success: true, message: "Access key deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
