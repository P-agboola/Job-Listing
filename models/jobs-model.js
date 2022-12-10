const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "job must have an employer"],
    },
    companyName: {
      type: String,
      required: [true, "please enter the company name"],
    },
    comapnyAddress: {
      type: String,
      required: [true, " Enter company address"],
    },
    companyWebsite: {
      type: String,
    },
    companyType: {
      type: String,
      required: [true, "Enter company type"],
      enum: [
        "Software",
        "Digital",
        "Manufacturing",
        "Banking",
        "Security",
        "Health",
        "Telecommunication",
        "others",
      ],
    },
    jobTitle: {
      type: String,
      required: [true, "Please enter the job title"],
    },
    jobDescription: {
      type: String,
      required: [true, "please enter the job description"],
    },
    jobSkills: {
      type: String,
      required: [true, "please input the required Skills for the Job"],
    },
    location: {
      type: String,
      required: [true, " please enter job location"],
      enum: ["Lagos", "Abuja", "Ogun", "Kano"],
    },
    jobType: {
      type: String,
      required: [true, "Please enter the job type"],
      enum: ["Remote", "Physical", "Hybrid"],
    },
    workType: {
      type: String,
      required: [true, "Please enter the work type"],
      enum: ["Full Time", "Part Time", "Contract"],
    },

    isAvailable: {
      type: Boolean,
      required: [true, "A job must have an availability field "],
      default: true,
    },
    salary: {
      type: String,
    },
    yearsOfExperience: {
      type: String,
      required: [true, "please enter year of experience needed"],
      enum: [
        "No experience",
        "1 year",
        "2 years",
        "3 years",
        "4 ears",
        "5 years and above",
      ],
    },
    keywords: {
      type: String,
      required: [true, "Please enter the job location"],
      enum: [
        "Nodejs",
        "TypeScript",
        "Nestjs",
        "Figma",
        "Backend",
        "Frontend",
        "Product",
        "Javascripts",
        "Accounting",
        "Engineering",
        "CyberSecurity",
        "HTMl",
        "CSS",
      ],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
  }
);

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
