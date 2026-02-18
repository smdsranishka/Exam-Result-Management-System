const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.use(roleMiddleware(["STUDENT"]));

router.get("/profile", studentController.getProfile);
router.put("/update-photo", studentController.updatePhoto);
router.get("/results/level/:level", studentController.getResultsByLevel);

module.exports = router;
