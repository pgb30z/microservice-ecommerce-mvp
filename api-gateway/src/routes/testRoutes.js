import express from "express";
import { authenticateToken } from "../middleware/authMiddleware.js";
import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

router.get(
  "/protected",
  authenticateToken,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "You can access protected route",
      user: req.user,
    });
  }
);
router.get(
  "/rate-limit",
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Rate limit test successful",
    });
  }
);

router.get(
  "/admin",
  authenticateToken,
  authorizeRole("ADMIN"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Welcome ADMIN",
      user: req.user,
    });
  }
);

export default router;