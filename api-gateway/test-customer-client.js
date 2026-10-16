import { customerClient } from "./src/grpc/customerClient.js";

customerClient.getCustomer(
  {
    uid: 1,
  },
  (error, response) => {
    if (error) {
      console.error(
        "Gateway -> Customer failed:"
      );

      console.error(
        error.message
      );

      process.exit(1);
    }

    console.log(
      "Gateway -> Customer successful!"
    );

    console.log(response);

    process.exit(0);
  }
);