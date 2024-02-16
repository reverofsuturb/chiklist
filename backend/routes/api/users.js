const express = require("express");
const bcrypt = require("bcryptjs");

const { check } = require("express-validator");
const {
  handleValidationErrors,
  validateSignup,
} = require("../../utils/validation");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const router = express.Router();

//Sign up route -- takes in username, email, password, hashes with bcrypt, awaits successful create, uses setTokenCookie() to create JWT cookie with the non-sensitive information as the payload
router.post("/", validateSignup, async (req, res) => {
  const { firstName, lastName, email, password, username } = req.body;
  const hashedPassword = bcrypt.hashSync(password);
  const user = await User.create({
    firstName,
    lastName,
    email,
    username,
    hashedPassword,
  });

  const safeUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    username: user.username,
  };

  await setTokenCookie(res, safeUser);

  return res.json({
    user: safeUser,
  });
});

module.exports = router;
