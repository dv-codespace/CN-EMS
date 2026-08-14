const adminService = require("../services/admin.auth.service");

exports.register = async (req, res) => {
  try {
    const result = await adminService.registerAdmin(req.body);
    res.status(201).json({ success: true, ...result });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await adminService.loginAdmin(req.body);
    res.status(200).json({ success: true, ...result });
  } catch (e) {
    res.status(401).json({ success: false, message: e.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await adminService.getAdminProfile(req.user.adminID);
    res.status(200).json({ success: true, admin: result });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const result = await adminService.updateAdminProfile(req.user.adminID, req.body);
    res.status(200).json({ success: true, ...result });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
