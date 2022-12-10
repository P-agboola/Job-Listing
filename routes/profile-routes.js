const express = require("express");
const { protect, restrictTo } = require("../contollers/auth-controllers");
const {
  createProfile,
  getProfile,
  updateprofile,
  deleteProfile,
  getProfiles,
} = require("../contollers/profile-controllers");
const router = express.Router();

router.post("/createProfile", protect, restrictTo("user"), createProfile);
router.get("/", protect, restrictTo("admin"), getProfiles);
router
  .route("/:id")
  .get(protect, getProfile)
  .patch(protect, updateprofile)
  .delete(protect, deleteProfile);

module.exports = router;
