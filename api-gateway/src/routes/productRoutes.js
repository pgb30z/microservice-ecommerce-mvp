import express from "express";

import { productClient } from "../grpc/productClient.js";

import { authenticateToken } from "../middleware/authMiddleware.js";

import { authorizeRole } from "../middleware/authorizeRole.js";

const router = express.Router();

/* =========================
   GET ALL PRODUCTS
========================= */

router.get(
  "/",
  authenticateToken,

  (req, res) => {
    productClient.getProducts(
      {},

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
          products: response.products,
        });
      }
    );
  }
);

/* =========================
   GET PRODUCT BY PID
========================= */

router.get(
  "/:pid",
  authenticateToken,

  (req, res) => {
    productClient.getProduct(
      {
        pid: Number(req.params.pid),
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
          product: response,
        });
      }
    );
  }
);

/* =========================
   CREATE PRODUCT
   ADMIN ONLY
========================= */

router.post(
  "/",
  authenticateToken,
  authorizeRole("ADMIN"),

  (req, res) => {
    const {
  pid,
  pname,
  price,
  quantity,
} = req.body;

productClient.createProduct(
  {
    pid: Number(pid),
    pname: pname,
    price: Number(price),
    quantity: Number(quantity),
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

    return res.status(201).json({
      success: true,
      product: response,
    });
  }
);
  }
);

/* =========================
   UPDATE PRODUCT
   ADMIN ONLY
========================= */

router.put(
  "/:pid",
  authenticateToken,
  authorizeRole("ADMIN"),

  (req, res) => {
    productClient.updateProduct(
      {
        pid: Number(req.params.pid),
        pname: req.body.pname,
        price: Number(req.body.price),
        quantity: Number(
          req.body.quantity
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

        return res.status(200).json({
          success: true,
          product: response,
        });
      }
    );
  }
);

/* =========================
   DELETE PRODUCT
   ADMIN ONLY
========================= */

router.delete(
  "/:pid",
  authenticateToken,
  authorizeRole("ADMIN"),

  (req, res) => {
    productClient.deleteProduct(
      {
        pid: Number(req.params.pid),
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

        return res.status(200).json(
          response
        );
      }
    );
  }
);

export default router;