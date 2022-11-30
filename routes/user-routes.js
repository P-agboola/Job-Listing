const express = require("express");
const { signUp, signIn } = require("../contollers/auth-controllers");

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);

module.exports = router;
