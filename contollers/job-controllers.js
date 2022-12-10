const User = require("../models/User-model");
const Profile = require("../models/Profile-model");
const CatchAsync = require("../utils/catch-async");
const Job = require("../models/Jobs-model");
const ErrorObject = require("../utils/error");
const QueryMethod = require("../utils/query");

exports.createJob = CatchAsync(async (req, res, next) => {
  const {
    companyName,
    comapnyAddress,
    companyWebsite,
    companyType,
    jobTitle,
    jobDescription,
    jobSkills,
    location,
    jobType,
    workType,
    salary,
    yearsOfExperience,
    keywords,
  } = req.body;
  const userId = req.user.id;
  const job = await Job.create({
    employerId: userId,
    companyName,
    comapnyAddress,
    companyWebsite,
    companyType,
    jobTitle,
    jobDescription,
    jobSkills,
    location,
    jobType,
    workType,
    salary,
    yearsOfExperience,
    keywords,
  });
  return res.status(201).json({
    status: "success",
    error: false,
    message: " You have successfully posted a job",
    data: {
      job,
    },
  });
});

// update a job
exports.updateJob = CatchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new ErrorObject(`No job with the id ${req.params.id}`, 400));
  }
  if (req.user.role !== "admin") {
    if (req.user.id !== job.employerId.toString()) {
      return next(new ErrorObject("You are not authorised", 403));
    }
  }
  const companyName =
    req.body.companyName === undefined ? job.companyName : req.body.companyName;
  const comapnyAddress =
    req.body.comapnyAddress === undefined
      ? job.comapnyAddress
      : req.body.comapnyAddress;
  const companyWebsite =
    req.body.companyWebsite === undefined
      ? job.companyWebsite
      : req.body.companyWebsite;
  const companyType =
    req.body.companyType === undefined ? job.companyType : req.body.companyType;
  const jobTitle =
    req.body.jobTitle === undefined ? job.jobTitle : req.body.jobTitle;
  const jobDescription =
    req.body.jobDescription === undefined
      ? job.jobDescription
      : req.body.jobDescription;
  const jobSkills =
    req.body.jobSkills === undefined ? job.jobSkills : req.body.jobSkills;
  const location =
    req.body.location === undefined ? job.location : req.body.location;
  const jobType =
    req.body.jobType === undefined ? job.jobType : req.body.jobType;
  const workType =
    req.body.workType === undefined ? job.workType : req.body.workType;
  const salary = req.body.salary === undefined ? job.salary : req.body.salary;
  const yearsOfExperience =
    req.body.yearsOfExperience === undefined
      ? job.yearsOfExperience
      : req.body.yearsOfExperience;
  const keywords =
    req.body.keywords === undefined ? job.keywords : req.body.keywords;
  const update = {
    companyName,
    comapnyAddress,
    companyWebsite,
    companyType,
    jobTitle,
    jobDescription,
    jobSkills,
    location,
    jobType,
    workType,
    salary,
    yearsOfExperience,
    keywords,
  };
  const updatedJob = await Job.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  return res.status(201).json({
    status: " success",
    error: false,
    message: "Job updated successfully",
    data: {
      job: updatedJob,
    },
  });
});

// Delete a job
exports.deletejob = CatchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(
      new ErrorObject(`There is no job with the id ${req.params.id}`, 400)
    );
  }
  if (req.user.role !== "admin") {
    if (req.user.id !== job.employerId.toString()) {
      return next(new ErrorObject("You are not authorised", 403));
    }
  }
  await Job.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: " deleted successfully",
  });
});

//  Get One job
exports.getjob = CatchAsync(async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(
      new ErrorObject(`There is no job  with the id ${req.params.id}`, 400)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      job,
    },
  });
});

// get all jobs created by employer
exports.getJobsByEmployer = CatchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const jobs = await Job.find({ employerId: userId });
  if (!jobs) {
    return next(
      new ErrorObject("You have not created or posted any Jobs", 400)
    );
  }
  res.status(200).json({
    status: "success",
    error: false,
    message: "Here are the jobs you have posted",
    results: jobs.length,
    data: {
      jobs,
    },
  });
});

//  Get All jobs
exports.getAlljobs = CatchAsync(async (req, res, next) => {
  let queriedjobs = new QueryMethod(Job.find(), req.query)
    .sort()
    .filter()
    .limit()
    .paginate();
  let jobs = await queriedjobs.query;
  res.status(200).json({
    status: "success",
    results: jobs.length,
    data: {
      jobs,
    },
  });
});

// job recommendation by user skills and experience
exports.recommendJobs = CatchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const userProfile = await Profile.findOne({ userId: userId });
  if (!userProfile) {
    return next(new ErrorObject("Please create a profile", 400));
  }
  const recommendedJobs = await Job.find({
    jobSkills: userProfile.skills,
    yearsOfExperience: userProfile.yearsOfExperience,
  });
  if (!recommendedJobs) {
    return next(
      new ErrorObject("No availiable Jobs  that suits your profile", 400)
    );
  }
  return res.status(200).json({
    status: "success",
    error: false,
    message: "Here are Jobs that suits your profile.Apply Now!",
    data: {
      recommendedJobs,
    },
  });
});
