const express = require("express");
const router = express.Router();
const supervisorController = require("../controllers/supervisorController");
const {
  authMiddleware,
  roleMiddleware,
} = require("../middlewares/authMiddleware");

const commonController = require("../controllers/commonController");

router.use(authMiddleware);
router.use(roleMiddleware(["SUPERVISOR", "ADMIN"])); // Allow both roles for lookups

router.get("/faculties", commonController.getFaculties);
router.get("/courses", commonController.getCourses);

router.post(
  "/create-admin",
  roleMiddleware(["SUPERVISOR"]),
  supervisorController.createAdmin,
);
router.post(
  "/create-access-key",
  roleMiddleware(["SUPERVISOR"]),
  supervisorController.createAccessKey,
);
router.get(
  "/admins",
  roleMiddleware(["SUPERVISOR"]),
  supervisorController.getAdmins,
);

router.get(
  "/access-keys",
  roleMiddleware(["SUPERVISOR"]),
  supervisorController.getAccessKeys,
);

router.delete(
  "/delete-access-key/:id",
  roleMiddleware(["SUPERVISOR"]),
  supervisorController.deleteAccessKey,
);

module.exports = router;
