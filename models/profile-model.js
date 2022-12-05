const { default: mongoose } = require("mongoose");
const validator = require("validator");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User needed to create a profile"],
    },
    cv: {
      type: String,
      required: [true, "user must have a cv"],
    },
    address: {
      type: String,
      required: [true, "user must provide an address"],
    },
    skills: {
      type: String,
      required: [true, "user must provide skill(s)"],
    },
    yearsOfExperience: {
      type: String,
      required: [true, "user must years of experince"],
    },
    experience: {
      type: String,
    },
    linkedlnUrl: {
      type: String,
      validate: {
        validator: (val) => {
          return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(
            val
          );
        },
        message: "Not a url",
      },
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true },

  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

const Profile = mongoose.model("Profile", profileSchema);
module.exports = Profile;
