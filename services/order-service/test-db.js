import prisma from "./src/infrastructure/database/prisma.js";

async function main() {
  try {
    const orderCount =
      await prisma.order.count();

    const detailCount =
      await prisma.orderDetail.count();

    console.log(
      "Order PostgreSQL connected!"
    );

    console.log(
      "Orders:",
      orderCount
    );

    console.log(
      "Order Details:",
      detailCount
    );
  } catch (error) {
    console.error(
      "Database test failed:",
      error.message
    );
  } finally {
    await prisma.$disconnect();
  }
}

main();