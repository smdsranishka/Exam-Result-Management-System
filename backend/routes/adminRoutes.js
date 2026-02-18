const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.use(roleMiddleware(["ADMIN"]));

router.post("/add-student", adminController.addStudent);
router.get("/students", adminController.getStudents);
router.post("/add-subject", adminController.addSubject);
router.get("/subjects", adminController.getSubjects);
router.delete("/delete-subject/:id", adminController.deleteSubject);
router.post("/add-result", adminController.addResult);
router.put("/update-result/:id", adminController.updateResult);
router.get("/results/:studentId", adminController.getResults);
router.get("/get-stats", adminController.getDashboardStats);
router.post("/verify-key", adminController.verifyKey);

module.exports = router;
