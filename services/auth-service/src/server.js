import "dotenv/config";

import express from "express";
import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

import { authGrpcHandler } from "./interfaces/grpc/authGrpcHandler.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../../../shared/proto/auth.proto"
);

const packageDefinition = protoLoader.loadSync(
  PROTO_PATH,
  {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  }
);

const authProto =
  grpc.loadPackageDefinition(packageDefinition).auth;

/* =========================
   gRPC SERVER
========================= */

const grpcServer = new grpc.Server();

grpcServer.addService(
  authProto.AuthService.service,
  authGrpcHandler
);

const GRPC_PORT =
  process.env.GRPC_PORT || 50051;

grpcServer.bindAsync(
  `0.0.0.0:${GRPC_PORT}`,
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error(
        "Failed to start Auth gRPC Server:",
        error
      );

      process.exit(1);
    }

    console.log(
      `Auth gRPC Server is running on port ${port}`
    );
  }
);

/* =========================
   HTTP HEALTH CHECK
========================= */

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    service: "auth-service",
    status: "UP",
  });
});

const HTTP_PORT =
  process.env.HTTP_PORT || 4001;

app.listen(HTTP_PORT, () => {
  console.log(
    `Auth HTTP Server is running on port ${HTTP_PORT}`
  );
});