import express from "express";
import Admin from "../models/admin.js";
import Anime from "../models/anime.js";
import {
  adminLogin,
  adminGoogleLogin,
  sendAdminOTP,
  resetAdminPassword,
} from "../controllers/adminController.js";
import verifyAdmin from "../middleware/verifyAdmin.js";

const router = express.Router();

/* =================== AUTH =================== */

// Email + password login
router.post("/login", adminLogin);

// Google login (credential JWT from frontend)
router.post("/google-login", adminGoogleLogin);

// Forgot password - send OTP
router.post("/forgot-password", sendAdminOTP);

// Reset password using OTP
router.post("/reset-password", resetAdminPassword);

/* =================== PROTECTED (TEST) =================== */

// Test route to check token + admin
// GET /api/admin/me
router.get("/me", verifyAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.user._id).select("name email role img"); 
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({
      message: "Admin authenticated",
      admin, // now includes name and email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/admin/active
router.get("/active", verifyAdmin, async (req, res) => {
  try {
    const admins = await Admin.find()
      .select("name email img lastActive isOnline")
      .sort({ lastActive: -1 });

    res.json({ admins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch admin activity" });
  }
});

// GET /api/admin/dashboard-stats
router.get("/dashboard-stats", verifyAdmin, async (req, res) => {
  try {
    const totalAnime = await Anime.countDocuments();
    const totalAdmins = await Admin.countDocuments();

    res.json({
      totalAnime,
      totalAdmins,
      activeSessions: 1,     // placeholder for now
      todayViews: 0,         // placeholder
      recentActivity: []     // you can wire this later
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
});


export default router;
