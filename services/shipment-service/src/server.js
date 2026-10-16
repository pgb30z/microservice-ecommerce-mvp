import "dotenv/config";

import express from "express";
import mongoose from "mongoose";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";

import {
  fileURLToPath,
} from "url";

import {
  connectMongoDB,
} from "./infrastructure/database/mongodb.js";

import {
  startOrderCreatedConsumer,
} from "./infrastructure/kafka/orderCreatedConsumer.js";

import {
  shipmentGrpcHandler,
} from "./interfaces/grpc/shipmentGrpcHandler.js";

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
    "../../../shared/proto/shipment.proto"
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

const shipmentProto =
  grpc.loadPackageDefinition(
    packageDefinition
  ).shipment;


/* =========================
   gRPC
========================= */

const grpcServer =
  new grpc.Server();

grpcServer.addService(
  shipmentProto
    .ShipmentService
    .service,

  shipmentGrpcHandler
);

const GRPC_PORT =
  process.env.GRPC_PORT ||
  50055;


/* =========================
   HTTP
========================= */

const app =
  express();

app.use(
  express.json()
);

app.get(
  "/health",

  (req, res) => {

    const connected =
      mongoose.connection
        .readyState === 1;

    return res
      .status(
        connected
          ? 200
          : 503
      )
      .json({
        service:
          "shipment-service",

        status:
          connected
            ? "UP"
            : "DOWN",

        database:
          connected
            ? "connected"
            : "disconnected",
      });
  }
);

const HTTP_PORT =
  process.env.HTTP_PORT ||
  4005;


/* =========================
   START
========================= */

async function startServer() {

  await connectMongoDB();

  grpcServer.bindAsync(
    `0.0.0.0:${GRPC_PORT}`,

    grpc
      .ServerCredentials
      .createInsecure(),

    (error, port) => {

      if (error) {
        console.error(
          "Shipment gRPC failed:",
          error
        );

        process.exit(1);
      }

      console.log(
        `Shipment gRPC Server is running on port ${port}`
      );
    }
  );

  app.listen(
    HTTP_PORT,

    () => {
      console.log(
        `Shipment HTTP Server is running on port ${HTTP_PORT}`
      );
    }
  );

  await startOrderCreatedConsumer();
}

startServer()
  .catch(
    (error) => {
      console.error(
        "Shipment Service failed:",
        error
      );

      process.exit(1);
    }
  );