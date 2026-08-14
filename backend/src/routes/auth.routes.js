const express = require("express");
const router = express.Router();

const {
  register,
  login,
  updateProfile,
  getProfile,
  deleteProfile
} = require("../controllers/auth.controller");

const authMiddleware = require("../middleware/auth");

// Routes
router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.delete("/profile", authMiddleware, deleteProfile);

module.exports = router;
