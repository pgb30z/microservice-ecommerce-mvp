import "dotenv/config";
import express from "express";

import authRoutes from "./routes/authRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";

import { connectRedis } from "./config/redisClient.js";
import { rateLimiter } from "./middleware/rateLimiter.js";
import { httpLogger } from "./middleware/httpLogger.js";

import {
  checkSystemHealth,
} from "./utils/healthCheck.js";

import customerRoutes from "./routes/customerRoutes.js";


const app = express();

app.use(express.json());

app.use(httpLogger);

app.use("/api", rateLimiter);

app.use("/api/auth", authRoutes);

app.use(
  "/api/shipments",
  shipmentRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/customers",
  customerRoutes
);
app.use("/api/test", testRoutes);
app.use(
  "/api/products",
  productRoutes
);

app.get(
  "/health",

  async (req, res) => {

    const health =
      await checkSystemHealth();

    return res
      .status(
        health.status === "UP"
          ? 200
          : 503
      )
      .json(health);
  }
);

app.get("/health", async (req, res) => {
  const health =
    await checkSystemHealth();

  return res
    .status(
      health.status === "UP"
        ? 200
        : 503
    )
    .json(health);
});

const PORT =
  process.env.PORT || 3000;

async function startServer() {
  try {
    await connectRedis();

    app.listen(PORT, () => {
      console.log(
        `API Gateway is running on port ${PORT}`
      );
    });
  } catch (error) {
    console.error(
      "Failed to start API Gateway:",
      error
    );

    process.exit(1);
  }
}

startServer();