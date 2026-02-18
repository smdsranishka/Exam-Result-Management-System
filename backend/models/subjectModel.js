const db = require("../config/db");

class Subject {
  static async create(subjectData) {
    const { subjectCode, subjectName, level, courseId } = subjectData;
    await db.execute(
      "INSERT INTO subjects (subjectCode, subjectName, level, courseId) VALUES (?, ?, ?, ?)",
      [subjectCode, subjectName, level, courseId],
    );
  }

  static async getAllByCourse(courseId) {
    const [rows] = await db.execute(
      "SELECT * FROM subjects WHERE courseId = ?",
      [courseId],
    );
    return rows;
  }

  static async delete(id) {
    await db.execute("DELETE FROM subjects WHERE id = ?", [id]);
  }

  static async getAllByFaculty(facultyId) {
    const [rows] = await db.execute(
      `
            SELECT s.*, c.name as courseName 
            FROM subjects s 
            JOIN courses c ON s.courseId = c.id 
            WHERE c.facultyId = ?
        `,
      [facultyId],
    );
    return rows;
  }
}

module.exports = Subject;
