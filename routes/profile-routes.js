const express = require("express");
const { protect, restrictTo } = require("../contollers/auth-controllers");
const {
  createProfile,
  getProfile,
  updateprofile,
  deleteProfile,
  getProfiles,
  uploadUserCv,
  resizeUserCV,
} = require("../contollers/profile-controllers");
const router = express.Router();

router.post("/createProfile", protect, restrictTo("user"), uploadUserCv,resizeUserCV ,createProfile);
router.get("/", protect, restrictTo("admin"), getProfiles);
router
  .route("/:id")
  .get(protect, getProfile)
  .patch(protect,uploadUserCv,resizeUserCV,updateprofile)
  .delete(protect, deleteProfile);

module.exports = router;
