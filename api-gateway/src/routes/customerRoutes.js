import express from "express";

import { customerClient } from "../grpc/customerClient.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   GET CUSTOMER PROFILE
========================= */

router.get(
  "/:uid",
  authenticateToken,

  (req, res) => {
    const uid =
      Number(req.params.uid);

    /*
      USER chỉ xem chính mình.
      ADMIN có thể xem user khác.
    */
    if (
      req.user.role !== "ADMIN" &&
      req.user.uid !== uid
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    customerClient.getCustomer(
      {
        uid,
      },

      (error, response) => {
        if (error) {
          return res.status(404).json({
            success: false,
            message:
              error.details ||
              error.message,
          });
        }

        return res.status(200).json({
          success: true,
          customer: response,
        });
      }
    );
  }
);

/* =========================
   UPDATE CUSTOMER
========================= */

router.put(
  "/:uid",
  authenticateToken,

  (req, res) => {
    const uid =
      Number(req.params.uid);

    if (
      req.user.role !== "ADMIN" &&
      req.user.uid !== uid
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    customerClient.updateCustomer(
      {
        uid,
        fullname: req.body.fullname,
      },

      (error, response) => {
        if (error) {
          return res.status(400).json({
            success: false,
            message:
              error.details ||
              error.message,
          });
        }

        return res.status(200).json({
          success: true,
          customer: response,
        });
      }
    );
  }
);
router.get(
  "/:uid/membership",
  authenticateToken,
  (req, res) => {
    const uid = Number(req.params.uid);

    if (
      req.user.role !== "ADMIN" &&
      req.user.uid !== uid
    ) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    customerClient.getMembershipScore(
      { uid },
      (error, data) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }

        return res.json(data);
      }
    );
  }
);
export default router;