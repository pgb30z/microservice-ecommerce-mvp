import "dotenv/config";

import express from "express";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";

import {
  startOutboxWorker,
} from "./infrastructure/kafka/outboxWorker.js";

import {
  fileURLToPath,
} from "url";

import prisma from "./infrastructure/database/prisma.js";

import {
  orderGrpcHandler,
} from "./interfaces/grpc/orderGrpcHandler.js";

const __filename =
  fileURLToPath(
    import.meta.url
  );

const __dirname =
  path.dirname(
    __filename
  );

const PROTO_PATH =
  path.resolve(
    __dirname,
    "../../../shared/proto/order.proto"
  );

const packageDefinition =
  protoLoader.loadSync(
    PROTO_PATH,
    {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    }
  );

const orderProto =
  grpc.loadPackageDefinition(
    packageDefinition
  ).order;

/* =========================
   gRPC SERVER
========================= */

const grpcServer =
  new grpc.Server();

grpcServer.addService(
  orderProto
    .OrderService
    .service,

  orderGrpcHandler
);

const GRPC_PORT =
  process.env.GRPC_PORT ||
  50054;

/* =========================
   HTTP SERVER
========================= */

const app =
  express();

app.use(
  express.json()
);

app.get(
  "/health",

  async (
    req,
    res
  ) => {
    try {
      /*
        Kiểm tra PostgreSQL thật
      */

      await prisma.order.count();

      return res
        .status(200)
        .json({
          service:
            "order-service",

          status:
            "UP",

          database:
            "connected",
        });

    } catch (error) {
      return res
        .status(503)
        .json({
          service:
            "order-service",

          status:
            "DOWN",

          database:
            "disconnected",
        });
    }
  }
);

const HTTP_PORT =
  process.env.HTTP_PORT ||
  4004;

/* =========================
   START
========================= */

function startServer() {

  grpcServer.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,

    grpc.ServerCredentials.createInsecure(),

    (error, port) => {
      if (error) {
        console.error(
          "Order gRPC failed:",
          error
        );

        process.exit(1);
      }

      console.log(
        `Order gRPC Server is running on port ${port}`
      );
    }
  );

  app.listen(
    HTTP_PORT,
    () => {
      console.log(
        `Order HTTP Server is running on port ${HTTP_PORT}`
      );
    }
  );

  /*
    Tự động xử lý Outbox
    mỗi 5 giây
  */
  startOutboxWorker(5000);
}

startServer();