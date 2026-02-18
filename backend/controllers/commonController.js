const db = require("../config/db");

exports.getFaculties = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM faculties");
    res.json({ success: true, faculties: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM courses");
    res.json({ success: true, courses: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
