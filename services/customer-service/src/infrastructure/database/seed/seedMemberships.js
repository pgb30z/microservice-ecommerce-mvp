import prisma from "../prisma.js";

async function seedMemberships() {
  await prisma.membership.upsert({
    where: {
      mname: "STANDARD",
    },
    update: {},
    create: {
      mname: "STANDARD",
      score: 0,
    },
  });

  console.log("Memberships seeded successfully!");
}

seedMemberships()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });