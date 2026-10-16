import prisma from "./src/infrastructure/database/prisma.js";

import { CreateOrder } from "./src/application/use-cases/CreateOrder.js";

import { GetOrder } from "./src/application/use-cases/GetOrder.js";

async function main() {
  const createOrder =
    new CreateOrder();

  const getOrder =
    new GetOrder();

  try {
    const order =
      await createOrder.execute({
        uid: 4,

        discount: 0,

        items: [
          {
            pid: 1,
            qty: 2,
            unit_price: 15000000,
          },
        ],
      });

    console.log(
      "Order created successfully!"
    );

    console.log(order);

    const found =
      await getOrder.execute(
        order.oid
      );

    console.log(
      "\nOrder loaded from database:"
    );

    console.log(found);
  } catch (error) {
    console.error(
      "Order test failed:",
      error.message
    );
  } finally {
    await prisma.$disconnect();
  }
}

main();