import prisma from "./src/infrastructure/database/prisma.js";

async function main() {
  const roles = await prisma.role.findMany();

  console.log("Database connection successful!");
  console.log("Roles:", roles);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });