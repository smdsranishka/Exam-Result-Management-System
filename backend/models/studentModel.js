const db = require("../config/db");

class Student {
  static async create(studentData) {
    const { userId, fullName, studentNumber, academicYear, courseId } =
      studentData;
    await db.execute(
      "INSERT INTO students (userId, fullName, studentNumber, academicYear, courseId) VALUES (?, ?, ?, ?, ?)",
      [userId, fullName, studentNumber, academicYear, courseId],
    );
  }

  static async getAllByFaculty(facultyId) {
    const [rows] = await db.execute(
      `
            SELECT s.*, u.username, c.name as courseName 
            FROM students s 
            JOIN users u ON s.userId = u.id 
            JOIN courses c ON s.courseId = c.id 
            WHERE u.facultyId = ?
        `,
      [facultyId],
    );
    return rows;
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute(
      `
            SELECT s.*, u.username, f.name as facultyName, c.name as courseName 
            FROM students s 
            JOIN users u ON s.userId = u.id 
            JOIN faculties f ON u.facultyId = f.id 
            JOIN courses c ON s.courseId = c.id 
            WHERE s.userId = ?
        `,
      [userId],
    );
    return rows[0];
  }

  static async updatePhoto(userId, photoUrl) {
    await db.execute("UPDATE students SET photoUrl = ? WHERE userId = ?", [
      photoUrl,
      userId,
    ]);
  }

  // Result related methods
  static async addResult(studentId, subjectId, marks, grade, gpa) {
    await db.execute(
      "INSERT INTO results (studentId, subjectId, marks, grade, gpa) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE marks = ?, grade = ?, gpa = ?",
      [studentId, subjectId, marks, grade, gpa, marks, grade, gpa],
    );
  }

  static async updateResult(resultId, marks, grade, gpa) {
    await db.execute(
      "UPDATE results SET marks = ?, grade = ?, gpa = ? WHERE id = ?",
      [marks, grade, gpa, resultId],
    );
  }

  static async getResults(studentId) {
    const [rows] = await db.execute(
      `
            SELECT r.*, s.subjectCode, s.subjectName, s.level 
            FROM results r 
            JOIN subjects s ON r.subjectId = s.id 
            WHERE r.studentId = ?
        `,
      [studentId],
    );
    return rows;
  }

  static async getResultsByLevel(studentUserId, level) {
    const [rows] = await db.execute(
      `
            SELECT r.*, sub.subjectCode, sub.subjectName, sub.level 
            FROM results r 
            JOIN students s ON r.studentId = s.id 
            JOIN subjects sub ON r.subjectId = sub.id 
            WHERE s.userId = ? AND sub.level = ?
        `,
      [studentUserId, level],
    );
    return rows;
  }
}

module.exports = Student;
