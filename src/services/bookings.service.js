import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const bookingSelect = {
  id: true,
  checkinDate: true,
  checkoutDate: true,
  numberOfGuests: true,
  totalPrice: true,
  bookingStatus: true,
  userId: true,
  propertyId: true,
  user: {
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      pictureUrl: true,
    },
  },
  property: {
    select: {
      id: true,
      title: true,
      location: true,
      pricePerNight: true,
      hostId: true,
    },
  },
};

export async function getAllBookings(filters = {}) {
  const where = {};

  if (filters.userId) {
    where.userId = {
      equals: filters.userId,
    };
  }

  return prisma.booking.findMany({
    where: Object.keys(where).length ? where : undefined,
    select: bookingSelect,
  });
}


export async function getBookingById(id) {
  return prisma.booking.findUnique({
    where: { id },
    select: bookingSelect,
  });
}

export async function createBooking(data) {
  return prisma.booking.create({
    data: {
      id: data.id || uuidv4(),
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      numberOfGuests: Number(data.numberOfGuests),
      totalPrice: Number(data.totalPrice),
      bookingStatus: data.bookingStatus,
      userId: data.userId,
      propertyId: data.propertyId,
    },
    select: bookingSelect,
  });
}

export async function updateBooking(id, data) {
  return prisma.booking.update({
    where: { id },
    data: {
      checkinDate: data.checkinDate,
      checkoutDate: data.checkoutDate,
      numberOfGuests: Number(data.numberOfGuests),
      totalPrice: Number(data.totalPrice),
      bookingStatus: data.bookingStatus,
      userId: data.userId,
      propertyId: data.propertyId,
    },
    select: bookingSelect,
  });
}

export async function deleteBooking(id) {
  return prisma.booking.delete({
    where: { id },
    select: bookingSelect,
  });
}