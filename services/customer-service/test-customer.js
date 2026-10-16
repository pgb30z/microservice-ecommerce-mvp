import { CreateCustomer } from "./src/application/use-cases/CreateCustomer.js";
import prisma from "./src/infrastructure/database/prisma.js";

async function main() {

  const createCustomer =
    new CreateCustomer();

  const customer =
    await createCustomer.execute({
      uid: 1,
      fullname: "User One",
    });

  console.log(
    "Customer created successfully!"
  );

  console.log(customer);
}

main()
  .catch((error) => {
    console.error(
      "Create customer failed:"
    );

    console.error(error.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });