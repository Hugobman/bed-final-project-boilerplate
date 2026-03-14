import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

const reviewSelect = {
  id: true,
  rating: true,
  comment: true,
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

export async function getAllReviews() {
  return prisma.review.findMany({
    select: reviewSelect,
  });
}

export async function getReviewById(id) {
  return prisma.review.findUnique({
    where: { id },
    select: reviewSelect,
  });
}

export async function createReview(data) {
  return prisma.review.create({
    data: {
      id: data.id || uuidv4(),
      rating: Number(data.rating),
      comment: data.comment,
      userId: data.userId,
      propertyId: data.propertyId,
    },
    select: reviewSelect,
  });
}

export async function updateReview(id, data) {
  return prisma.review.update({
    where: { id },
    data: {
      rating: Number(data.rating),
      comment: data.comment,
      userId: data.userId,
      propertyId: data.propertyId,
    },
    select: reviewSelect,
  });
}

export async function deleteReview(id) {
  return prisma.review.delete({
    where: { id },
    select: reviewSelect,
  });
}
