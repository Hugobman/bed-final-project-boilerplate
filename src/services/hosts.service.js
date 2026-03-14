import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const hostSelect = {
  id: true,
  username: true,
  name: true,
  email: true,
  phoneNumber: true,
  pictureUrl: true,
  aboutMe: true,
};

export async function getAllHosts() {
  return prisma.host.findMany({
    select: hostSelect,
  });
}

export async function getHostById(id) {
  return prisma.host.findUnique({
    where: { id },
    select: hostSelect,
  });
}

export async function createHost(data) {
  return prisma.host.create({
    data: {
      id: data.id || uuidv4(),
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      pictureUrl: data.pictureUrl,
      aboutMe: data.aboutMe,
    },
    select: hostSelect,
  });
}

export async function updateHost(id, data) {
  return prisma.host.update({
    where: { id },
    data: {
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      pictureUrl: data.pictureUrl,
      aboutMe: data.aboutMe,
    },
    select: hostSelect,
  });
}

export async function deleteHost(id) {
  return prisma.$transaction(async (tx) => {
    const properties = await tx.property.findMany({
      where: { hostId: id },
      select: { id: true },
    });

    const propertyIds = properties.map((property) => property.id);

    if (propertyIds.length > 0) {
      await tx.review.deleteMany({
        where: {
          propertyId: { in: propertyIds },
        },
      });

      await tx.booking.deleteMany({
        where: {
          propertyId: { in: propertyIds },
        },
      });

      await tx.property.deleteMany({
        where: {
          id: { in: propertyIds },
        },
      });
    }

    return tx.host.delete({
      where: { id },
      select: hostSelect,
    });
  });
}
