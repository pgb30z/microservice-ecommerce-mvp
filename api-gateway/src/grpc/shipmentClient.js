import "dotenv/config";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

const __filename =
  fileURLToPath(import.meta.url);

const __dirname =
  path.dirname(__filename);

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

export const shipmentClient =
  new shipmentProto.ShipmentService(
    process.env.SHIPMENT_GRPC_URL ||
      "localhost:50055",

    grpc.credentials.createInsecure()
  );