const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    return res.status(201).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.loginUser(req.body);
    return res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const result = await authService.updateUserProfile(
      req.user.userId,
      req.body
    );

    return res.status(200).json({
      success: true,
      ...result
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const result = await authService.getUserProfile(req.user.userId);
    return res.status(200).json({
      success: true,
      user: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    await authService.deleteUserProfile(req.user.userId);
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};
