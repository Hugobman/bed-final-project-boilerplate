import { PrismaClient } from "@prisma/client";

import usersData from "../src/data/users.json" with { type: "json" };
import hostsData from "../src/data/hosts.json" with { type: "json" };
import propertiesData from "../src/data/properties.json" with { type: "json" };
import bookingsData from "../src/data/bookings.json" with { type: "json" };
import reviewsData from "../src/data/reviews.json" with { type: "json" };

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.property.deleteMany();
  await prisma.host.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: usersData.users,
  });

  await prisma.host.createMany({
    data: hostsData.hosts,
  });

  await prisma.property.createMany({
    data: propertiesData.properties,
  });

  await prisma.booking.createMany({
    data: bookingsData.bookings,
  });

  await prisma.review.createMany({
    data: reviewsData.reviews,
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });