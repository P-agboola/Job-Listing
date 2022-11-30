const { default: mongoose, Schema } = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { use } = require("../app");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      validate: [validator.isEmail, "Enter a valid  Email"],
    },
    address: {
      type: String,
      required: true,
    },
    skills: {
      type: true,
      required: true,
    },
    experience: {
      type: string,
      required: true,
    },
    Password: {
      type: String,
      required: [true, "password is required"],
      select: false,
      minLength: [8, "password must have minimum of 8 characters"],
      validate: {
        validator: function (val) {
          return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z\d]{8,}/.test(val);
        },
        message:
          "Password must contain at least a number, a lowercase and an uppercase alphabeth",
      },
    },
    confirmPassword: {
      type: String,
      select: false,
      required: [true, "password is required"],
      validate: {
        validator: function (val) {
          return val === this.password;
        },
        message: "Password and confirm password must be the same",
      },
    },
    passwordResetToken: String,
    passwordChangedAt: Date,
    passwwordTokenExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

userSchema.pre("save", async (next) => {
  if (!this.isModified("password")) {
    return next();
  }
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  this.confirmPassword = undefined;
});

userSchema.methods.createPasswordResetToken = () => {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwwordTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changePasswordAfter = (JWTTimeStamp) => {
  if (this.passwordChangedAt) {
    console.log(JWTTimeStamp < this.passwordChangedAt);
    return JWTTimeStamp < this.passwordChangedAt;
  }
  return false;
};

const User = mongoose.model("User", userSchema);
module.exports = User;
