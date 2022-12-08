const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const CatchAsync = require("../utils/catch-async");
const User = require("../models/User-model");
const ErrorObject = require("../utils/error");
const sendEmail = require("../utils/email");

const { JWT_EXPIRES_IN, JWT_SECRET, JWT_COOKIE_EXPIRES_IN, NODE_ENV } =
  process.env;

const signToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
const createAndSendToken = CatchAsync(async (user, statusCode, res) => {
  const token = await signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRES_IN * 24 * 60 * 1000),
    httpOnly: true,
  };
  if (NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user },
  });
});

// Authentication
exports.protect = CatchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new ErrorObject("You are not logged in.Kindly Login or SignUp", 401)
    );
  }
  const decodedToken = await jwt.verify(token, JWT_SECRET);
  const currentUser = await User.findById(decodedToken.id);
  req.user = currentUser;
  next();
});

// Authorization
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorObject("You are not authorised to perform this action.", 403)
      );
    }
    next();
  };
};

// signUp
exports.signUp = CatchAsync(async (req, res, next) => {
  const { fullName, email, phoneNumber, password, role, confirmPassword } =
    req.body;
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return next(new ErrorObject("Email already exist"), 409);
  }
  if (password !== confirmPassword) {
    return next(new ErrorObject("Wrong Password Confirmation input", 400));
  }
  const user = await User.create({
    fullName,
    email,
    phoneNumber,
    role,
    password,
    confirmPassword,
  });
  createAndSendToken(user, 201, res);
});

//signIn
exports.signIn = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorObject("Enter your email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(
      new ErrorObject("There is no user with the provided email address"),
      404
    );
  }
  const newConfirmPassword = await bcrypt.compare(password, user.password);
  if (!newConfirmPassword || !user) {
    return next(new ErrorObject("Invalid email or password", 401));
  }
  createAndSendToken(user, 200, res);
});
exports.forgotPassword = CatchAsync(async (req, res, next) => {
  // 1. Get User based on posted email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new ErrorObject("There is no user with the provided email address", 404)
    );
  }
  // 2. Generate random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3. Send token to the email addess
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/reset-password/${resetToken}`;

  const message = `To reset your password click on the link below to submit your new password: ${resetUrl}`;

  try {
    await sendEmail({
      message,
      email: user.email,
      subject: "Your password reset url. It's valid for 10mins",
    });

    res.status(200).json({
      status: "success",
      message: "Token has been sent to your mail",
      resetUrl,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordTokenExpires = undefined;
    await user.save();
    next(new ErrorObject("Error while sending the token to your mail", 500));
  }
});

exports.resetPassword = CatchAsync(async (req, res, next) => {
  const hashToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken: hashToken,
    passwordTokenExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorObject("Token is invalid or it has expired", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordTokenExpires = undefined;
  user.passwordChangedAt = Date.now() - 1000;
  await user.save();

  createAndSendToken(user, 200, res);
});

exports.updatePassword = CatchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");
  const { newPassword, newConfirmPassword } = req.body;
  if (!(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ErrorObject("Your password is incorrect", 401));
  }

  user.password = newPassword;
  user.confirmPassword = newConfirmPassword;
  await user.save();

  createAndSendToken(user, 200, res);
});
