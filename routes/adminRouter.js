import express from "express";
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
router.get("/me", verifyAdmin, (req, res) => {
  res.json({
    message: "Admin authenticated",
    admin: req.user, // contains { _id, role }
  });
});

export default router;
