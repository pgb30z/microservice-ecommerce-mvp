import "dotenv/config";

import express from "express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

import { customerGrpcHandler } from "./interfaces/grpc/customerGrpcHandler.js";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../../../shared/proto/customer.proto"
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

const customerProto =
  grpc.loadPackageDefinition(
    packageDefinition
  ).customer;

/* =====================
   gRPC
===================== */

const grpcServer =
  new grpc.Server();

grpcServer.addService(
  customerProto.CustomerService.service,
  customerGrpcHandler
);

const GRPC_PORT =
  process.env.GRPC_PORT || 50052;

grpcServer.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error(
        "Customer gRPC failed:",
        error
      );

      process.exit(1);
    }

    console.log(
      `Customer gRPC Server is running on port ${port}`
    );
  }
);

/* =====================
   HTTP HEALTH
===================== */

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "customer-service",
    status: "UP",
  });
});

const HTTP_PORT =
  process.env.HTTP_PORT || 4002;

app.listen(HTTP_PORT, () => {
  console.log(
    `Customer HTTP Server is running on port ${HTTP_PORT}`
  );
});