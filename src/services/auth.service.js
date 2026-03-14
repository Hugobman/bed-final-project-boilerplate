import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findUserByCredentials(username, password) {
  const user = await prisma.user.findFirst({
    where: {
      username,
      password,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
    },
  });

  if (user) {
    return { ...user, role: "user" };
  }

  const host = await prisma.host.findFirst({
    where: {
      username,
      password,
    },
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
    },
  });

  if (host) {
    return { ...host, role: "host" };
  }

  return null;
}