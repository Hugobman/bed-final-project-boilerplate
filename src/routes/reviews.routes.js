import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviews.service.js";

const router = express.Router();

function validateReviewBody(body) {
  const requiredFields = ["rating", "comment", "userId", "propertyId"];

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === "") {
      return `Missing required field: ${field}`;
    }
  }

  return null;
}

router.get("/", async (req, res, next) => {
  try {
    const reviews = await getAllReviews();
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const review = await getReviewById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(200).json(review);
  } catch (error) {
    next(error);
  }
});

router.post("/",  async (req, res, next) => {
  try {
    const validationError = validateReviewBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newReview = await createReview(req.body);
    res.status(201).json(newReview);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const existingReview = await getReviewById(req.params.id);

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    const mergedReview = {
      ...existingReview,
      ...req.body,
    };

    const updatedReview = await updateReview(req.params.id, mergedReview);
    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
});


router.delete("/:id",  async (req, res, next) => {
  try {
    const existingReview = await getReviewById(req.params.id);

    if (!existingReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    const deletedReview = await deleteReview(req.params.id);
    res.status(200).json(deletedReview);
  } catch (error) {
    next(error);
  }
});

export default router;
