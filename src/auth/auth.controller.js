const env = require("dotenv").config();

const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { registerUser, loginUser, getUsers } = require("./auth.services");
const { authenticateToken } = require("../middleware");

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(5).required(),
});

router.get("/", (req, res) => {
  res.json({
    message: "Hello from auth",
  });
});

router.post("/register", async (req, res) => {
  const { value, error } = registerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.log(error);
    return res.status(400).json({
      error: `${error.details.map((detail) => detail.context.label)}`,
      type: `${error.details.map((detail) => detail.type)}`,
    });
  }

  try {
    await registerUser(value);
    res.status(201).json({ message: "Register success" });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      error: error.code == "P2002" ? "Email already exists" : "Failed",
    });
  }
});

router.post("/login", async (req, res) => {
  const { value, error } = loginSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    console.log(error);
    return res.status(400).json({
      error: `${error.details.map((detail) => detail.context.label)}`,
      type: `${error.details.map((detail) => detail.type)}`,
    });
  }

  try {
    const result = await loginUser(value.email, value.password);

    res.status(201).json({
      message: "Login success",
      user: result.user,
      token: result.token,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: error.message });
  }
});

router.get("/users", authenticateToken, async (req, res) => {
  try {
    const users = await getUsers();

    res.status(200).json({ message: "Success", users });
  } catch (error) {
    return res.status(500).json({ error: "Failed" });
  }
});

module.exports = router;
