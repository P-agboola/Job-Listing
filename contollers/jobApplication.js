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
  const jobAppilcation = await JobApplication.findById(req.params.id);
  if (!jobAppilcation) {
    return next(
      new ErrorObject(
        `There is no jobApplication with the ID ${req.params.id}`,
        400
      )
    );
  }
  if (employerId !== jobApplication.employerId) {
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
  const jobAppilcation = await JobApplication.find({ jobId: req.params.jobId });
  if (!jobAppilcation) {
    return next(new ErrorObject("No job application yet", 400));
  }
  if (employerId !== jobApplication.employerId) {
    return next(new ErrorObject("You are not authorised", 400));
  }
  return res.status(200).json({
    status: "success",
    error: false,
    results: jobAppilcation.length,
    data: {
      jobAppilcation,
    },
  });
});

exports.getAllJobApplicationByEmployer = CatchAsync(async (req, res, next) => {
  const employerId = req.user.id;
  const jobAppilcations = await JobApplication.find({ employerId });
  if (employerId !== jobAppilcations.employerId) {
    return next(new ErrorObject("You are not authorised", 400));
  }
  return res.status(200).json({
    status: "success",
    error: false,
    results: jobAppilcations.length,
    data: {
      jobAppilcations,
    },
  });
});

exports.getOneJobApplication = CatchAsync(async (req, res, next) => {
  const jobAppilcation = await JobApplication.find(req.params.id);
  if (!jobAppilcation) {
    return next(
      new ErrorObject(
        `There is no jobApplication with the ID ${req.params.id}`,
        400
      )
    );
  }
  if (req.user.role !== "admin" || req.user.id !== jobAppilcation.employerId) {
    if (req.user.id !== jobAppilcations.userId) {
      return next(new ErrorObject("You are not authorised", 400));
    }
  }
  return res.status(200).json({
    status: "success",
    error: false,
    data: {
      jobAppilcation,
    },
  });
});

exports.getAllJobApplicationByUser = CatchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const jobAppilcations = await JobApplication.find({ userId });
  if (userId !== jobAppilcations.userId) {
    return next(new ErrorObject("You are not authorised", 400));
  }
  return res.status(200).json({
    status: "success",
    error: false,
    message: "These are the jobs you have applied for:",
    results: jobAppilcations.length,
    data: {
      jobAppilcations,
    },
  });
});

exports.deleteJobAppllication = CatchAsync(async (req, res, next) => {
  const jobAppilcation = await JobApplication.find(req.params.id);
  if (!jobAppilcation) {
    return next(
      new ErrorObject(
        `There is no jobApplication with the ID ${req.params.id}`,
        400
      )
    );
  }
  if (req.user.role !== "admin") {
    if (req.user.id !== jobAppilcations.employerId) {
      return next(new ErrorObject("You are not authorised", 400));
    }
  }
  await JobApplication.findByIdAndDelete(req.params.id);
  return res.status(204).json({
    status: "Deleted successfully",
  });
});
