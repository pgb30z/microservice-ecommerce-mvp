import express from "express";
import { authClient } from "../grpc/authClient.js";
import { customerClient } from "../grpc/customerClient.js";

const router = express.Router();

/* =========================
   REGISTER
========================= */

router.post("/register", (req, res) => {
  const {
    username,
    password,
    fullname,
  } = req.body;

  if (!username || !password || !fullname) {
    return res.status(400).json({
      success: false,
      message:
        "Username, password and fullname are required",
    });
  }

  /* =========================
     STEP 1: CREATE AUTH USER
  ========================= */

  authClient.register(
    {
      username,
      password,
      fullname,
    },

    (authError, authResponse) => {
      if (authError) {
        return res.status(400).json({
          success: false,
          message:
            authError.details ||
            authError.message,
        });
      }

      /* =========================
         STEP 2: CREATE CUSTOMER
      ========================= */

      customerClient.createCustomer(
        {
          uid: authResponse.uid,
          fullname,
        },

        (customerError, customerResponse) => {
          if (customerError) {
            console.error(
              "Customer creation failed:",
              customerError.message
            );

            return res.status(500).json({
              success: false,

              message:
                "User created but customer profile creation failed",

              uid: authResponse.uid,
            });
          }

          return res.status(201).json({
            success: true,

            message:
              "Register successful",

            user: {
              uid: authResponse.uid,
              role: authResponse.role,
            },

            customer: {
              uid: customerResponse.uid,
              fullname:
                customerResponse.fullname,

              membership: {
                mid: customerResponse.mid,
                name: customerResponse.mname,
                score:
                  customerResponse.score,
              },
            },
          });
        }
      );
    }
  );
});

/* =========================
   LOGIN
========================= */

router.post("/login", (req, res) => {
  const {
    username,
    password,
  } = req.body;

  authClient.login(
    {
      username,
      password,
    },
    (error, response) => {
      if (error) {
        return res.status(401).json({
          success: false,
          message: error.details || error.message,
        });
      }

      return res.status(200).json(response);
    }
  );
});

export default router;