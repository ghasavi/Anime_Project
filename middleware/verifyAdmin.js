import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";

export default async function verifyAdmin(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);

    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Admin only" });

    // 🔥 update activity
    await Admin.findByIdAndUpdate(decoded._id, {
      lastActive: new Date(),
      isOnline: true,
    });

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
