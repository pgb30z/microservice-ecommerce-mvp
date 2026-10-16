import "dotenv/config";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

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

export const customerClient =
  new customerProto.CustomerService(
    process.env.CUSTOMER_GRPC_URL ||
      "localhost:50052",

    grpc.credentials.createInsecure()
  );