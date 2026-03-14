import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const userSelect = {
  id: true,
  username: true,
  name: true,
  email: true,
  phoneNumber: true,
  pictureUrl: true,
};

export async function getAllUsers(filters = {}) {
  const where = {};

  if (filters.username) {
    where.username = {
      equals: filters.username,
    };
  }

  if (filters.email) {
    where.email = {
      equals: filters.email,
    };
  }

  return prisma.user.findMany({
    where: Object.keys(where).length ? where : undefined,
    select: userSelect,
  });
}



export async function getUserById(id) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect,
  });
}

export async function createUser(data) {
  return prisma.user.create({
    data: {
      id: data.id || uuidv4(),
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      pictureUrl: data.pictureUrl,
    },
    select: userSelect,
  });
}

export async function updateUser(id, data) {
  return prisma.user.update({
    where: { id },
    data: {
      username: data.username,
      password: data.password,
      name: data.name,
      email: data.email,
      phoneNumber: data.phoneNumber,
      pictureUrl: data.pictureUrl,
    },
    select: userSelect,
  });
}

export async function deleteUser(id) {
  return prisma.$transaction(async (tx) => {
    await tx.review.deleteMany({
      where: { userId: id },
    });

    await tx.booking.deleteMany({
      where: { userId: id },
    });

    return tx.user.delete({
      where: { id },
      select: userSelect,
    });
  });
}
