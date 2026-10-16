import { connectMongoDB } from "./src/infrastructure/database/mongodb.js";

async function main() {
  await connectMongoDB();

  console.log(
    "MongoDB connection successful!"
  );

  process.exit(0);
}

main();