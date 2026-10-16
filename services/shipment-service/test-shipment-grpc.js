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
    "../../shared/proto/shipment.proto"
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

const client =
  new shipmentProto
    .ShipmentService(
      "localhost:50055",

      grpc.credentials
        .createInsecure()
    );

client.getShipmentByOrder(
  {
    oid: 1000,
  },

  (
    error,
    response
  ) => {

    if (error) {
      console.error(
        "GetShipmentByOrder failed:",
        error.message
      );

      process.exit(1);
    }

    console.log(
      "GetShipmentByOrder successful!"
    );

    console.log(
      response
    );

    process.exit(0);
  }
);