import prisma from "../prisma.js";

async function seedRoles() {
  await prisma.role.upsert({
    where: {
      rolename: "USER",
    },
    update: {},
    create: {
      rolename: "USER",
    },
  });

  await prisma.role.upsert({
    where: {
      rolename: "ADMIN",
    },
    update: {},
    create: {
      rolename: "ADMIN",
    },
  });

  console.log("Roles seeded successfully!");
}

seedRoles()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });