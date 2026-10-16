import "dotenv/config";

import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../../../shared/proto/product.proto"
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

const productProto =
  grpc.loadPackageDefinition(
    packageDefinition
  ).product;

export const productClient =
  new productProto.ProductService(
    process.env.PRODUCT_GRPC_URL ||
      "localhost:50053",

    grpc.credentials.createInsecure()
  );