import express from "express";

import {
  orderClient,
} from "../grpc/orderClient.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

const router =
  express.Router();

/*
=================================
POST /api/orders
Tạo đơn hàng
=================================
*/

router.post(
  "/",
  authenticateToken,

  (req, res) => {
    const { items } =
      req.body;

    /*
      Không lấy uid từ body.

      uid phải lấy từ JWT:
      req.user.uid
    */

    if (
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Order must contain at least one item",
      });
    }

    for (const item of items) {
      if (
        !item.pid ||
        Number(item.qty) <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid order item",
        });
      }
    }

    orderClient.createOrder(
      {
        uid:
          Number(req.user.uid),

        items:
          items.map(
            (item) => ({
              pid:
                Number(item.pid),

              qty:
                Number(item.qty),
            })
          ),
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

        return res
          .status(201)
          .json(response);
      }
    );
  }
);


/*
=================================
GET /api/orders
Xem đơn hàng của chính user
=================================
*/

router.get(
  "/",
  authenticateToken,

  (req, res) => {
    orderClient.getOrdersByUser(
      {
        uid:
          Number(req.user.uid),
      },

      (error, response) => {
        if (error) {
          return res.status(500).json({
            success: false,

            message:
              error.details ||
              error.message,
          });
        }

        return res.status(200).json({
          success: true,
          orders:
            response.orders,
        });
      }
    );
  }
);


/*
=================================
GET /api/orders/:oid
Xem chi tiết đơn
=================================
*/

router.get(
  "/:oid",
  authenticateToken,

  (req, res) => {
    const oid =
      Number(req.params.oid);

    if (!oid) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order ID",
      });
    }

    orderClient.getOrder(
      {
        oid,
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

        /*
          USER chỉ được xem
          đơn hàng của chính mình.

          ADMIN được xem tất cả.
        */

        if (
          req.user.role !== "ADMIN" &&
          Number(response.uid) !==
            Number(req.user.uid)
        ) {
          return res.status(403).json({
            success: false,
            message: "Forbidden",
          });
        }

        return res
          .status(200)
          .json(response);
      }
    );
  }
);

export default router;