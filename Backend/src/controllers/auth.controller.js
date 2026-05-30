const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

// FIX 5: Ensure uploads folder exists on startup — prevents crash if folder is missing
const uploadsDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

async function registerUser(req, res) {
  try {
    // role is NOT taken from req.body — hardcoded to "user" for security
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(409).json({
        message: "User Already Exists",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      username,
      email,
      password: hash,
      role: "user", // FIX 1: Always hardcoded — client cannot set role
    });

    // JWT expiry set to 7d
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // FIX 4: true in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // FIX 4: "none" for cross-domain in production
    });

    return res.status(201).json({
      message: "User registered successfully",
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error registering user",
    });
  }
}

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValidate = await bcrypt.compare(password, user.password);

    if (!isPasswordValidate) {
      return res.status(401).json({
        success: false,
        message: "Incorrect Password",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    return res.status(200).json({
      success: true,
      message: "User login successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (err) {
    console.log("LOGIN ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function logoutUser(req, res) {
  try {
    res.clearCookie("token");

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error logging out",
    });
  }
}

async function getProfile(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password");

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

async function uploadProfileImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const imageUrl = `${process.env.BACKEND_URL}/uploads/${req.file.filename}`;

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      {
        profileImage: imageUrl,
      },
      {
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded",
      user,
    });
  } catch (err) {
    console.log("UPLOAD ERROR:", err);
    console.log(err.response?.data);
    toast.error(err.response?.data?.message || "Upload failed");
    return res.status(500).json({
      success: false,
      message: "Upload failed",
    });
  }
}

async function updateProfile(req, res) {
  try {
    const { username, email } = req.body;

    // FIX 3: Check if email is already taken by another user before updating
    const existingUser = await userModel.findOne({
      email,
      _id: { $ne: req.user.id }, // $ne = not equal — exclude the current user
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already in use by another account",
      });
    }

    const user = await userModel.findByIdAndUpdate(
      req.user.id,
      { username, email },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error updating profile",
    });
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  uploadProfileImage,
  updateProfile,
};
