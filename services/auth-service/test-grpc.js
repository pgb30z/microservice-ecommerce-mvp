import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROTO_PATH = path.resolve(
  __dirname,
  "../../shared/proto/auth.proto"
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

const client =
  new authProto.AuthService(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

client.register(
  {
    username: "user02",
    password: "123456",
    fullname: "Nguyen Van A",
  },
  (error, response) => {
    if (error) {
      console.error("Register failed:");
      console.error(error.message);
      process.exit(1);
    }

    console.log("Register successful!");
    console.log(response);
    process.exit(0);
  }
);