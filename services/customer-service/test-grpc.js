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
  "../../shared/proto/customer.proto"
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

const client =
  new customerProto.CustomerService(
    "localhost:50052",
    grpc.credentials.createInsecure()
  );

client.getMembershipScore(
  {
    uid: 1,
  },
  (error, response) => {
    if (error) {
      console.error(
        "Get Membership failed:"
      );

      console.error(
        error.message
      );

      process.exit(1);
    }

    console.log(
      "Membership successful!"
    );

    console.log(response);

    process.exit(0);
  }
);