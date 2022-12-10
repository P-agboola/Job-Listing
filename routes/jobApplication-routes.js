const express = require("express");
const { protect, restrictTo } = require("../contollers/auth-controllers");
const {
  createJobApplication,
  getAllJobApplicationByUser,
  getAllJobApplicationByEmployer,
  updateJobStatus,
  getAllJobApplicationsForAJob,
  getOneJobApplication,
  deleteJobAppllication,
} = require("../contollers/jobApplication");
const router = express.Router();

router.post("/", protect, restrictTo("user"), createJobApplication);
router.get(
  "/user-job-applications",
  protect,
  restrictTo("user"),
  getAllJobApplicationByUser
);

router.get(
  "/all-job-apllications",
  protect,
  restrictTo("employer", "admin"),
  getAllJobApplicationByEmployer
);

router.patch(
  "/job-appliction/:id",
  protect,
  restrictTo("employer", "admin"),
  updateJobStatus
);

router.get(
  "/job-applications/:jobId",
  protect,
  restrictTo("employer", "admin"),
  getAllJobApplicationsForAJob
);

router.get("/application/:id", protect, getOneJobApplication);
router.delete(
  "/jobApllicaation/:id",
  protect,
  restrictTo("admin", "employer"),
  deleteJobAppllication
);

module.exports = router;
