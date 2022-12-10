const CatchAsync = require("../utils/catch-async");
const User = require("../models/User-model");
const ErrorObject = require("../utils/error");
const sendEmail = require("../utils/email");
const Profile = require("../models/Profile-model");
const QueryMethod = require("../utils/query");


exports.createProfile = CatchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const user = await User.findById(userId);
  const userProfile = await Profile.findOne({userId})
  if(userProfile){
    return next(new ErrorObject("You hvae already created a profile"),400)
  }
  const { cv, skills, address, yearsOfExperience, experience, linkedlnUrl } =
    req.body;
  const profile = await Profile.create({
    userId: userId,
    cv,
    skills,
    address,
    yearsOfExperience,
    experience,
    linkedlnUrl,
  });
  user.profile = profile.id;
  await user.save();
  return res.status(200).json({
    status: "success",
    error: false,
    message: "Your profile has been created successfully",
    data: {
      profile,
    },
  });
});

// Delete A Profile
exports.deleteProfile = CatchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return next(
      new ErrorObject(`There is no profile with the id ${req.params.id}`, 400)
    );
  }
  if (req.user.role !== "admin") {
    if (req.user.id !== profile.userId.toString()) {
      return next(new ErrorObject("You are not authorised", 403));
    }
  }
  await Profile.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: " deleted successfully",
  });
});

// Update A profile
exports.updateprofile = CatchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return next(
      new ErrorObject(`There is no profile with the id ${req.params.id}`, 400)
    );
  }
  if (req.user.role !== "admin") {
    if (req.user.id !== profile.userId.toString()) {
      return next(new ErrorObject("You are not authorised", 403));
    }
  }
  const cv = req.body.cv === undefined ? profile.cv : req.body.cv;
  const skills =
    req.body.skills === undefined ? profile.skills : req.body.skills;
  const address =
    req.body.address === undefined ? profile.address : req.body.address;
  const yearsOfExperience =
    req.body.yearsOfExperience === undefined
      ? profile.yearsOfExperience
      : req.body.yearsOfExperience;
  const experience =
    req.body.experience === undefined
      ? profile.experience
      : req.body.experience;
  const linkedlnUrl =
    req.body.linkedlnUrl === undefined
      ? profile.linkedlnUrl
      : req.body.linkedlnUrl;

  const update = {
    cv,
    skills,
    address,
    yearsOfExperience,
    experience,
    linkedlnUrl,
  };
  const updatedProfile = await Profile.findByIdAndUpdate(
    req.params.id,
    update,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: "success",
    data: {
      profile: updatedProfile,
    },
  });
});

//  Get One profile
exports.getProfile = CatchAsync(async (req, res, next) => {
  const profile = await Profile.findById(req.params.id);
  if (!profile) {
    return next(
      new ErrorObject(`There is no profile with the id ${req.params.id}`, 400)
    );
  }
  if (req.user.role !== "admin") {
    if (req.user.id !== profile.userId.toString()) {
      return next(new ErrorObject("You are not authorised", 403));
    }
  }

  res.status(200).json({
    status: "success",
    data: {
      profile,
    },
  });
});

//  Get All profile
exports.getProfiles = CatchAsync(async (req, res, next) => {
  if (req.user.role !== "admin"){
    return next(new ErrorObject("You are not authorised", 403));
  }
  let queriedProfiles = new QueryMethod (Profile.find(), req.query)
    .sort()
    .filter()
    .limit()
    .paginate();
  let profiles = await queriedProfiles.query;
  res.status(200).json({
    status: "success",
    results: profiles.length,
    data: {
      profiles,
    },
  });
});
