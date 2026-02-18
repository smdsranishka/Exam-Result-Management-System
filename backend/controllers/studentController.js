const Student = require("../models/studentModel");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `profile-${req.user.id}-${Date.now()}${path.extname(file.originalname)}`,
    );
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2000000 }, // 2MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    }
  },
}).single("photo");

exports.getProfile = async (req, res) => {
  try {
    const profile = await Student.findByUserId(req.user.id);
    if (!profile)
      return res
        .status(404)
        .json({ success: false, message: "Profile not found" });
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updatePhoto = (req, res) => {
  upload(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .json({ success: false, message: "File too large (MAX 2MB)" });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }

    if (!req.file)
      return res
        .status(400)
        .json({ success: false, message: "No file uploaded" });

    try {
      const photoUrl = `/uploads/${req.file.filename}`;
      await Student.updatePhoto(req.user.id, photoUrl);
      res.json({ success: true, message: "Photo updated", photoUrl });
    } catch (dbErr) {
      res.status(500).json({ success: false, message: dbErr.message });
    }
  });
};

exports.getResultsByLevel = async (req, res) => {
  try {
    const results = await Student.getResultsByLevel(
      req.user.id,
      req.params.level,
    );
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
