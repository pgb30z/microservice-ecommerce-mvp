import grpc from "@grpc/grpc-js";

import protoLoader from "@grpc/proto-loader";

import path from "path";

import {
  fileURLToPath,
} from "url";

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
    "../../shared/proto/order.proto"
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

const client =
  new orderProto.OrderService(
    "localhost:50054",

    grpc.credentials
      .createInsecure()
  );

client.getOrder(
  {
    oid: 2,
  },

  (
    error,
    response
  ) => {

    if (error) {
      console.error(
        "GetOrder failed:",
        error.message
      );

      process.exit(1);
    }

    console.log(
      "GetOrder successful!"
    );

    console.log(
      response
    );

    process.exit(0);
  }
);