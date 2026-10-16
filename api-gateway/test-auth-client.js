import { authClient } from "./src/grpc/authClient.js";

authClient.login(
  {
    username: "user01",
    password: "123456",
  },
  (error, response) => {
    if (error) {
      console.error("Gateway -> Auth gRPC failed:");
      console.error(error.message);
      process.exit(1);
    }

    console.log("Gateway -> Auth gRPC successful!");
    console.log(response);

    process.exit(0);
  }
);