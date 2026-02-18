const db = require("../config/db");

class User {
  static async findByUsername(username) {
    const [rows] = await db.execute("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(
      "SELECT id, username, role, facultyId, isFirstLogin FROM users WHERE id = ?",
      [id],
    );
    return rows[0];
  }

  static async updatePassword(id, hashedPassword) {
    await db.execute(
      "UPDATE users SET password = ?, isFirstLogin = 0 WHERE id = ?",
      [hashedPassword, id],
    );
  }

  static async createAdmin(username, hashedPassword, facultyId) {
    const [result] = await db.execute(
      'INSERT INTO users (username, password, role, facultyId, isFirstLogin) VALUES (?, ?, "ADMIN", ?, 1)',
      [username, hashedPassword, facultyId],
    );
    return result.insertId;
  }

  static async createStudentUser(username, hashedPassword, facultyId) {
    const [result] = await db.execute(
      'INSERT INTO users (username, password, role, facultyId, isFirstLogin) VALUES (?, ?, "STUDENT", ?, 1)',
      [username, hashedPassword, facultyId],
    );
    return result.insertId;
  }

  static async getAllAdmins() {
    const [rows] = await db.execute(`
            SELECT u.id, u.username, u.facultyId, f.name as facultyName, u.createdAt 
            FROM users u 
            JOIN faculties f ON u.facultyId = f.id 
            WHERE u.role = 'ADMIN'
        `);
    return rows;
  }
}

module.exports = User;
