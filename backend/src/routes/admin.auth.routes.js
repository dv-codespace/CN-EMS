const express = require("express");
const router = express.Router();
const adminController = require("../controllers/admin.auth.controller");
const authAdmin = require("../middleware/authAdmin");

router.post("/login", adminController.login);
router.post("/register", adminController.register); // optional
router.get("/profile", authAdmin, adminController.getProfile);
router.put("/profile", authAdmin, adminController.updateProfile);

module.exports = router;
