const Job = require("../models/Jobs-model");
const JobApplication = require("../models/JobsApplication-model");
const JobsApplication = require("../models/JobsApplication-model");
const User = require("../models/User-model");
const CatchAsync = require("../utils/catch-async");
const ErrorObject = require("../utils/error");

exports.createJobApplication = CatchAsync(async (req, res, next) => {
  userId = req.user.id;
  const { jobId } = req.body;
  const job = await Job.findOne({ jobId });
  if (!job) {
    return next(new ErrorObject(`There is no job with the ID ${jobId}`, 400));
  }
  const userApplication = await JobsApplication.findOne({ userId, jobId });
  if (userApplication) {
    return next(new ErrorObject("You have already applied for the Job", 400));
  }
  const jobApplication = await JobApplication.create({
    userId,
    jobId,
    employerId: job.employerId,
    status: "applied",
  });
  return res.status(201).json({
    status: "success",
    erorr: false,
    message: "You have successfully applied for the job",
    data: {
      jobApplication,
    },
  });
});

exports.updateJobStatus = CatchAsync(async (req, res, next) => {
  const employerId = req.user.id;
  const jobApplication = await JobApplication.findById(req.params.id);
  if (!jobApplication) {
    return next(
      new ErrorObject(
        `There is no jobApplication with the ID ${req.params.id}`,
        400
      )
    );
  }
  if (employerId !== jobApplication.employerId.toString()) {
    return next(new ErrorObject("You are not authorised", 400));
  }
  const updateJobApplication = await JobApplication.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status }
  );
  return res.status(200).json({
    status: "success",
    error: false,
    message: " Status successfully changed",
    data: {
      updateJobApplication,
    },
  });
});

exports.getAllJobApplicationsForAJob = CatchAsync(async (req, res, next) => {
  const employerId = req.user.id;
  const job = await Job.findById(req.params.jobId);
  const jobApplication = await JobApplication.find({
    jobId: req.params.jobId,
  });
  if (!jobApplication) {
    return next(new ErrorObject("No job application yet", 400));
  }
  if (employerId !== job.employerId.toString()) {
    return next(new ErrorObject("You are not authorised", 400));
  }
  return res.status(200).json({
    status: "success",
    error: false,
    results: jobApplication.length,
    data: {
      jobApplication,
    },
  });
});

exports.getAllJobApplicationByEmployer = CatchAsync(async (req, res, next) => {
  const employerId = req.user.id;
  const jobApplications = await JobApplication.find({ employerId: employerId });
  return res.status(200).json({
    status: "success",
    error: false,
    results: jobApplications.length,
    data: {
      jobApplications,
    },
  });
});

exports.getOneJobApplication = CatchAsync(async (req, res, next) => {
  const jobApplication = await JobApplication.findById(req.params.id);
  if (!jobApplication) {
    return next(
      new ErrorObject(
        `There is no jobApplication with the ID ${req.params.id}`,
        400
      )
    );
  }
  const role = req.user.role;
  if (role === "user" && req.user.id !== jobApplication.userId.id) {
    return next(new ErrorObject("You are not authorised", 400));
  }
  if (role === "employer" && req.user.id !== jobApplication.employerId.id) {
    return next(new ErrorObject("You are not authorised", 400));
  }
  return res.status(200).json({
    status: "success",
    error: false,
    data: {
      jobApplication,
    },
  });
});

exports.getAllJobApplicationByUser = CatchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const jobApplications = await JobApplication.find({ userId: userId });
  return res.status(200).json({
    status: "success",
    error: false,
    message: "These are the jobs you have applied for:",
    results: jobApplications.length,
    data: {
      jobApplications,
    },
  });
});

exports.deleteJobAppllication = CatchAsync(async (req, res, next) => {
  const jobApplication = await JobApplication.findById(req.params.id);
  if (!jobApplication) {
    return next(
      new ErrorObject(
        `There is no jobApplication with the ID ${req.params.id}`,
        400
      )
    );
  }
  const role = req.user.role
  if (role === "user" && req.user.id !== jobApplication.employerId.id) {
    return next(new ErrorObject("You are not authorised", 400));
  }
  await JobApplication.findByIdAndDelete(req.params.id);
  return res.status(204).json({
    status: "Deleted successfully",
  });
});
