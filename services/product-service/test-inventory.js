import { connectMongoDB } from "./src/infrastructure/database/mongodb.js";

import { CheckInventory } from "./src/application/use-cases/CheckInventory.js";

import { UpdateInventory } from "./src/application/use-cases/UpdateInventory.js";

async function main() {
  await connectMongoDB();

  const checkInventory =
    new CheckInventory();

  const updateInventory =
    new UpdateInventory();

  console.log(
    "\n=== CHECK INVENTORY ==="
  );

  const check =
    await checkInventory.execute({
      pid: 1,
      qty: 3,
    });

  console.log(check);

  console.log(
    "\n=== UPDATE INVENTORY ==="
  );

  const update =
    await updateInventory.execute({
      pid: 1,
      qty: 3,
    });

  console.log(update);

  process.exit(0);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});