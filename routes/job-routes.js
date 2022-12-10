const express = require("express");
const { protect, restrictTo } = require("../contollers/auth-controllers");
const {
  createJob,
  updateJob,
  getjob,
  deletejob,
  getAlljobs,
  recommendJobs,
  getJobsByEmployer,
} = require("../contollers/job-controllers");
const router = express.Router();

router.post("/createJob", protect, restrictTo("employer", "admin"), createJob);
router
  .route("/jobId/:id")
  .patch(protect, restrictTo("employer", "admin"), updateJob)
  .get(getjob)
  .delete(protect, restrictTo("employer", "admin"), deletejob);
router.get("/", getAlljobs);
router.get("/recommendedJobs/", protect, recommendJobs);
router.get(
  "/employerJobs/",
  protect,
  restrictTo("employer"),
  getJobsByEmployer
);

module.exports = router;
