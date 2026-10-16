import express from "express";

import {
  shipmentClient,
} from "../grpc/shipmentClient.js";

import {
  orderClient,
} from "../grpc/orderClient.js";

import {
  authenticateToken,
} from "../middleware/authMiddleware.js";

import {
  authorizeRole,
} from "../middleware/authorizeRole.js";

const router =
  express.Router();


function getOrderAsync(oid) {
  return new Promise(
    (resolve, reject) => {

      orderClient.getOrder(
        {
          oid: Number(oid),
        },

        (error, response) => {

          if (error) {
            return reject(error);
          }

          resolve(response);
        }
      );
    }
  );
}


function getShipmentAsync(shipid) {
  return new Promise(
    (resolve, reject) => {

      shipmentClient.getShipment(
        {
          shipid: Number(shipid),
        },

        (error, response) => {

          if (error) {
            return reject(error);
          }

          resolve(response);
        }
      );
    }
  );
}


function getShipmentByOrderAsync(oid) {
  return new Promise(
    (resolve, reject) => {

      shipmentClient.getShipmentByOrder(
        {
          oid: Number(oid),
        },

        (error, response) => {

          if (error) {
            return reject(error);
          }

          resolve(response);
        }
      );
    }
  );
}


/*
================================
GET /api/shipments/order/:oid
USER xem shipment của Order mình
ADMIN xem bất kỳ
================================
*/

router.get(
  "/order/:oid",
  authenticateToken,

  async (req, res) => {

    try {

      const oid =
        Number(req.params.oid);

      if (!oid) {
        return res.status(400).json({
          success: false,
          message: "Invalid order ID",
        });
      }

      /*
        Kiểm tra Order thuộc user nào
      */

      const order =
        await getOrderAsync(
          oid
        );

      if (
        req.user.role !== "ADMIN" &&
        Number(order.uid) !==
          Number(req.user.uid)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      const shipment =
        await getShipmentByOrderAsync(
          oid
        );

      return res
        .status(200)
        .json(shipment);

    } catch (error) {

      return res.status(404).json({
        success: false,

        message:
          error.details ||
          error.message,
      });
    }
  }
);


/*
================================
GET /api/shipments/:shipid
================================
*/

router.get(
  "/:shipid",
  authenticateToken,

  async (req, res) => {

    try {

      const shipment =
        await getShipmentAsync(
          req.params.shipid
        );

      /*
        Shipment cho biết oid.
        Ta lấy Order để kiểm tra ownership.
      */

      const order =
        await getOrderAsync(
          shipment.oid
        );

      if (
        req.user.role !== "ADMIN" &&
        Number(order.uid) !==
          Number(req.user.uid)
      ) {
        return res.status(403).json({
          success: false,
          message: "Forbidden",
        });
      }

      return res
        .status(200)
        .json(shipment);

    } catch (error) {

      return res.status(404).json({
        success: false,

        message:
          error.details ||
          error.message,
      });
    }
  }
);


/*
================================
PATCH /api/shipments/:shipid/status

Hiện hệ thống chỉ có USER/ADMIN,
nên tạm dùng ADMIN cho thao tác
cập nhật vận chuyển.
================================
*/

router.patch(
  "/:shipid/status",

  authenticateToken,

  authorizeRole("ADMIN"),

  (req, res) => {

    const {
      status,
    } = req.body;

    if (
      !status ||
      !String(status).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Shipment status is required",
      });
    }

    shipmentClient
      .updateShipmentStatus(
        {
          shipid:
            Number(
              req.params.shipid
            ),

          status:
            String(status)
              .trim(),
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
            .status(200)
            .json(response);
        }
      );
  }
);

export default router;