import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import Admin from "../models/admin.js";
import OTP from "../models/otp.js";
import transporter from "../utils/mailer.js";

dotenv.config();

/* =================== EMAIL + PASSWORD LOGIN =================== */
export async function adminLogin(req, res) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });

    if (!admin || !admin.password)
      return res.status(404).json({ message: "Admin not found" });

    const isMatch = bcrypt.compareSync(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      { _id: admin._id, role: "admin" },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    res.json({ message: "Login success", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
}

/* =================== GOOGLE LOGIN =================== */
export async function adminGoogleLogin(req, res) {
  try {
    const { accessToken } = req.body; // actually the credential JWT
    if (!accessToken)
      return res.status(400).json({ message: "Access token required" });

    // decode credential JWT to get email, name, picture
    const gAdmin = jwt.decode(accessToken); // <--- fixed

    // Only allow your admin emails
    const allowedAdmins = ["ghasavindya@gmail.com"];
    if (!allowedAdmins.includes(gAdmin.email))
      return res.status(403).json({ message: "Not an admin" });

    let admin = await Admin.findOne({ email: gAdmin.email });

    if (!admin) {
      admin = new Admin({
        email: gAdmin.email,
        name: gAdmin.name,
        img: gAdmin.picture,
      });
      await admin.save();
    }

    const token = jwt.sign(
      { _id: admin._id, role: "admin" },
      process.env.JWT_KEY,
      { expiresIn: "7d" }
    );

    res.json({ message: "Google login success", token });
  } catch (err) {
    console.error("GOOGLE LOGIN ERROR:", err.message);
    res
      .status(500)
      .json({ message: "Google login failed", error: err.message });
  }
}

/* =================== SEND OTP =================== */
export async function sendAdminOTP(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    // Remove old OTPs
    await OTP.deleteMany({ email });

    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
    await OTP.create({ email, otp });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: "Admin Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire soon.`,
    });

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
}

/* =================== RESET PASSWORD =================== */
export async function resetAdminPassword(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    const otpDoc = await OTP.findOne({ email });
    if (!otpDoc) return res.status(400).json({ message: "No OTP request found" });
    if (otp != otpDoc.otp) return res.status(403).json({ message: "Invalid OTP" });

    // Delete OTP
    await OTP.deleteMany({ email });

    // Update password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await Admin.updateOne({ email }, { password: hashedPassword });

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Password reset failed" });
  }
}

/* =================== HELPER =================== */
export function isAdmin(req) {
  return req.user?.role === "admin";
}
