import prisma from "./src/infrastructure/database/prisma.js";

import {
  PlaceOrder,
} from "./src/application/use-cases/PlaceOrder.js";

async function main() {
  const placeOrder =
    new PlaceOrder();

  try {
    const result =
      await placeOrder.execute({
        uid: 4,

        items: [
          {
            pid: 1,
            qty: 1,
          },
        ],
      });

    console.log(
      "\n=== ORDER SUCCESS ==="
    );

    console.dir(
      result,
      {
        depth: null,
      }
    );
  } catch (error) {
    console.error(
      "\n=== ORDER FAILED ==="
    );

    console.error(
      error.message
    );
  } finally {
    await prisma.$disconnect();
  }
}

main();