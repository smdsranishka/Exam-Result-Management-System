const bcrypt = require("bcryptjs");
const db = require("./config/db");

async function seed() {
  try {
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash("password123", salt);
    const supervisorPassword = await bcrypt.hash("supervisor123", salt);

    console.log("Starting seeding process...");

    // 1. Insert Faculties
    const faculties = ["Science", "Computing", "Medicine", "Humanities"];
    const facultyIds = {};
    for (const f of faculties) {
      const [result] = await db.execute(
        "INSERT IGNORE INTO faculties (name) VALUES (?)",
        [f],
      );
      if (result.insertId) {
        facultyIds[f] = result.insertId;
      } else {
        const [rows] = await db.execute(
          "SELECT id FROM faculties WHERE name = ?",
          [f],
        );
        facultyIds[f] = rows[0].id;
      }
    }
    console.log("Faculties seeded");

    // 2. Insert Supervisor
    await db.execute(
      'INSERT INTO users (username, password, role, facultyId, isFirstLogin) VALUES (?, ?, "SUPERVISOR", NULL, 0) ON DUPLICATE KEY UPDATE password = VALUES(password), isFirstLogin = 0',
      ["supervisor", supervisorPassword],
    );
    console.log("Supervisor seeded: supervisor / supervisor123");

    // 3. Insert Admin for Computing Faculty
    const computingId = facultyIds["Computing"];
    await db.execute(
      'INSERT INTO users (username, password, role, facultyId, isFirstLogin) VALUES (?, ?, "ADMIN", ?, 0) ON DUPLICATE KEY UPDATE password = VALUES(password), isFirstLogin = 0',
      ["admin_comp", password, computingId],
    );
    console.log("Admin seeded: admin_comp / password123");

    // 4. Insert Courses for Computing
    const courses = [
      "Software Engineering",
      "Computer Science",
      "Information Technology",
    ];
    const courseIds = {};
    for (const c of courses) {
      const [result] = await db.execute(
        "INSERT IGNORE INTO courses (name, facultyId) VALUES (?, ?)",
        [c, computingId],
      );
      if (result.insertId) {
        courseIds[c] = result.insertId;
      } else {
        const [rows] = await db.execute(
          "SELECT id FROM courses WHERE name = ? AND facultyId = ?",
          [c, computingId],
        );
        courseIds[c] = rows[0].id;
      }
    }
    console.log("Courses seeded for Computing");

    // 5. Insert Access Key for Computing
    const [supervisorRows] = await db.execute(
      "SELECT id FROM users WHERE username = 'supervisor'",
    );
    const supervisorId = supervisorRows[0].id;
    await db.execute(
      "INSERT IGNORE INTO access_keys (keyValue, facultyId, createdBySupervisorId, isUsed) VALUES (?, ?, ?, 0)",
      ["COMP2026", computingId, supervisorId],
    );
    console.log("Access Key seeded: COMP2026");

    // 6. Insert Students for Software Engineering
    const seId = courseIds["Software Engineering"];
    const studentsData = [
      {
        username: "std001",
        fullName: "Kasun Perera",
        studentNumber: "SE/2021/001",
        academicYear: "2021/2022",
      },
      {
        username: "std002",
        fullName: "Nimali Silva",
        studentNumber: "SE/2021/002",
        academicYear: "2021/2022",
      },
    ];

    for (const s of studentsData) {
      await db.execute(
        'INSERT INTO users (username, password, role, facultyId, isFirstLogin) VALUES (?, ?, "STUDENT", ?, 0) ON DUPLICATE KEY UPDATE isFirstLogin = 0',
        [s.username, password, computingId],
      );
      const [uRows] = await db.execute(
        "SELECT id FROM users WHERE username = ?",
        [s.username],
      );
      const userId = uRows[0].id;

      await db.execute(
        "INSERT INTO students (userId, fullName, studentNumber, academicYear, courseId) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE fullName = VALUES(fullName)",
        [userId, s.fullName, s.studentNumber, s.academicYear, seId],
      );
    }
    console.log("Students seeded");

    // 7. Insert Subjects for Software Engineering
    const subjects = [
      { code: "SENG 11213", name: "Data Structures", level: 1 },
      { code: "SENG 11223", name: "Programming Concepts", level: 1 },
      { code: "SENG 21213", name: "Software Architecture", level: 2 },
    ];

    const subjectIds = {};
    for (const sub of subjects) {
      await db.execute(
        "INSERT INTO subjects (subjectCode, subjectName, level, courseId) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE subjectName = VALUES(subjectName)",
        [sub.code, sub.name, sub.level, seId],
      );
      const [subRows] = await db.execute(
        "SELECT id FROM subjects WHERE subjectCode = ?",
        [sub.code],
      );
      subjectIds[sub.code] = subRows[0].id;
    }
    console.log("Subjects seeded");

    // 8. Insert Results for Student 1
    const [std1Rows] = await db.execute(
      "SELECT id FROM students WHERE studentNumber = 'SE/2021/001'",
    );
    const std1Id = std1Rows[0].id;

    const results = [
      { subCode: "SENG 11213", marks: 85, grade: "A", gpa: 4.0 },
      { subCode: "SENG 11223", marks: 78, grade: "A-", gpa: 3.7 },
      { subCode: "SENG 21213", marks: 92, grade: "A+", gpa: 4.0 },
    ];

    for (const r of results) {
      await db.execute(
        "INSERT INTO results (studentId, subjectId, marks, grade, gpa) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE marks = VALUES(marks), grade = VALUES(grade), gpa = VALUES(gpa)",
        [std1Id, subjectIds[r.subCode], r.marks, r.grade, r.gpa],
      );
    }
    console.log("Results seeded for std001");

    console.log("Seeding completed successfully!");
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
}

seed();
