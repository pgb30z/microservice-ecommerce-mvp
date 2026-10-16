import "dotenv/config";

import express from "express";
import mongoose from "mongoose";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

import { connectMongoDB } from "./infrastructure/database/mongodb.js";

import { productGrpcHandler } from "./interfaces/grpc/productGrpcHandler.js";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../../../shared/proto/product.proto"
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

const productProto =
  grpc.loadPackageDefinition(
    packageDefinition
  ).product;

/* =========================
   gRPC SERVER
========================= */

const grpcServer =
  new grpc.Server();

grpcServer.addService(
  productProto.ProductService.service,
  productGrpcHandler
);

const GRPC_PORT =
  process.env.GRPC_PORT || 50053;

/* =========================
   HTTP SERVER
========================= */

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {

  const mongoConnected =
    mongoose.connection.readyState === 1;

  const status =
    mongoConnected
      ? "UP"
      : "DOWN";

  res
    .status(mongoConnected ? 200 : 503)
    .json({
      service: "product-service",
      status,
      database:
        mongoConnected
          ? "connected"
          : "disconnected",
    });
});

const HTTP_PORT =
  process.env.HTTP_PORT || 4003;

/* =========================
   START SERVICE
========================= */

async function startServer() {
  try {

    await connectMongoDB();

    grpcServer.bindAsync(
      `0.0.0.0:${GRPC_PORT}`,
      grpc.ServerCredentials.createInsecure(),
      (error, port) => {

        if (error) {
          console.error(
            "Product gRPC failed:",
            error
          );

          process.exit(1);
        }

        console.log(
          `Product gRPC Server is running on port ${port}`
        );
      }
    );

    app.listen(
      HTTP_PORT,
      () => {
        console.log(
          `Product HTTP Server is running on port ${HTTP_PORT}`
        );
      }
    );

  } catch (error) {

    console.error(
      "Product Service failed:",
      error
    );

    process.exit(1);
  }
}

startServer();