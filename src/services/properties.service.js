import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const propertySelect = {
  id: true,
  title: true,
  description: true,
  location: true,
  pricePerNight: true,
  bedroomCount: true,
  bathRoomCount: true,
  maxGuestCount: true,
  rating: true,
  hostId: true,
  host: {
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
      aboutMe: true,
    },
  },
  bookings: {
    select: {
      id: true,
    },
  },
  reviews: {
    select: {
      id: true,
    },
  },
};

export async function getAllProperties(filters = {}) {
  const where = {};

  if (filters.location) {
    where.location = {
      equals: filters.location,
    };
  }

  if (filters.pricePerNight) {
    where.pricePerNight = Number(filters.pricePerNight);
  }

  return prisma.property.findMany({
    where: Object.keys(where).length ? where : undefined,
    select: propertySelect,
  });
}



export async function getPropertyById(id) {
  return prisma.property.findUnique({
    where: { id },
    select: propertySelect,
  });
}

export async function createProperty(data) {
  return prisma.property.create({
    data: {
      id: data.id || uuidv4(),
      title: data.title,
      description: data.description,
      location: data.location,
      pricePerNight: Number(data.pricePerNight),
      bedroomCount: Number(data.bedroomCount),
      bathRoomCount: Number(data.bathRoomCount),
      maxGuestCount: Number(data.maxGuestCount),
      rating: Number(data.rating),
      hostId: data.hostId,
    },
    select: propertySelect,
  });
}

export async function updateProperty(id, data) {
  return prisma.property.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      location: data.location,
      pricePerNight: Number(data.pricePerNight),
      bedroomCount: Number(data.bedroomCount),
      bathRoomCount: Number(data.bathRoomCount),
      maxGuestCount: Number(data.maxGuestCount),
      rating: Number(data.rating),
      hostId: data.hostId,
    },
    select: propertySelect,
  });
}

export async function deleteProperty(id) {
  return prisma.$transaction(async (tx) => {
    await tx.review.deleteMany({
      where: { propertyId: id },
    });

    await tx.booking.deleteMany({
      where: { propertyId: id },
    });

    return tx.property.delete({
      where: { id },
      select: propertySelect,
    });
  });
}
