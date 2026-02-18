const db = require("../config/db");

class Faculty {
  static async getAll() {
    const [rows] = await db.execute("SELECT * FROM faculties");
    return rows;
  }

  static async createAccessKey(keyValue, facultyId, supervisorId) {
    await db.execute(
      "INSERT INTO access_keys (keyValue, facultyId, createdBySupervisorId) VALUES (?, ?, ?)",
      [keyValue, facultyId, supervisorId],
    );
  }

  static async verifyAccessKey(keyValue, facultyId) {
    const [rows] = await db.execute(
      "SELECT * FROM access_keys WHERE keyValue = ? AND facultyId = ? AND isUsed = 0",
      [keyValue, facultyId],
    );
    return rows[0];
  }

  static async getAccessKeys() {
    const [rows] = await db.execute(`
            SELECT ak.*, f.name as facultyName, u.username as creatorName 
            FROM access_keys ak
            JOIN faculties f ON ak.facultyId = f.id
            JOIN users u ON ak.createdBySupervisorId = u.id
            ORDER BY ak.createdAt DESC
        `);
    return rows;
  }

  static async deleteAccessKey(id) {
    await db.execute("DELETE FROM access_keys WHERE id = ? AND isUsed = 0", [
      id,
    ]);
  }
}

module.exports = Faculty;
