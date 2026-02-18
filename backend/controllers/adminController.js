const User = require("../models/userModel");
const Student = require("../models/studentModel");
const Subject = require("../models/subjectModel");
const Faculty = require("../models/facultyModel");
const db = require("../config/db");
const bcrypt = require("bcryptjs");

exports.addStudent = async (req, res) => {
  try {
    const {
      username,
      password,
      fullName,
      studentNumber,
      academicYear,
      courseId,
    } = req.body;

    const existingUser = await User.findByUsername(username);
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, message: "Username exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await User.createStudentUser(
      username,
      hashedPassword,
      req.user.facultyId,
    );
    await Student.create({
      userId,
      fullName,
      studentNumber,
      academicYear,
      courseId,
    });

    res
      .status(201)
      .json({ success: true, message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.getAllByFaculty(req.user.facultyId);
    res.json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addSubject = async (req, res) => {
  try {
    await Subject.create(req.body);
    res
      .status(201)
      .json({ success: true, message: "Subject added successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.getAllByFaculty(req.user.facultyId);
    res.json({ success: true, subjects });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    await Subject.delete(req.params.id);
    res.json({ success: true, message: "Subject deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.addResult = async (req, res) => {
  try {
    const { studentId, subjectId, marks, grade, gpa } = req.body;
    await Student.addResult(studentId, subjectId, marks, grade, gpa);
    res.status(201).json({ success: true, message: "Result added/updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateResult = async (req, res) => {
  try {
    const { marks, grade, gpa } = req.body;
    await Student.updateResult(req.params.id, marks, grade, gpa);
    res.json({ success: true, message: "Result updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getResults = async (req, res) => {
  try {
    const results = await Student.getResults(req.params.studentId);
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyKey = async (req, res) => {
  try {
    const { keyValue } = req.body;
    const key = await Faculty.verifyAccessKey(keyValue, req.user.facultyId);
    if (!key)
      return res
        .status(400)
        .json({ success: false, message: "Invalid or already used key" });

    await Faculty.markKeyAsUsed(key.id);
    res.json({ success: true, message: "Key verified successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const facultyId = req.user.facultyId;

    const [studentRows] = await db.execute(
      "SELECT COUNT(*) as total FROM students s JOIN users u ON s.userId = u.id WHERE u.facultyId = ?",
      [facultyId],
    );

    const [courseRows] = await db.execute(
      "SELECT COUNT(*) as total FROM courses WHERE facultyId = ?",
      [facultyId],
    );

    const [subjectRows] = await db.execute(
      "SELECT COUNT(*) as total FROM subjects s JOIN courses c ON s.courseId = c.id WHERE c.facultyId = ?",
      [facultyId],
    );

    res.json({
      success: true,
      stats: {
        students: studentRows[0].total,
        courses: courseRows[0].total,
        subjects: subjectRows[0].total,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
