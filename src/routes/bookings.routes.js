import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
} from "../services/bookings.service.js";

const router = express.Router();

function validateBookingBody(body) {
  const requiredFields = [
    "checkinDate",
    "checkoutDate",
    "numberOfGuests",
    "totalPrice",
    "bookingStatus",
    "userId",
    "propertyId",
  ];

  for (const field of requiredFields) {
    if (body[field] === undefined || body[field] === null || body[field] === "") {
      return `Missing required field: ${field}`;
    }
  }

  return null;
}

router.get("/", async (req, res, next) => {
  try {
    const bookings = await getAllBookings({
      userId: req.query.userId,
    });

    res.status(200).json(bookings);
  } catch (error) {
    next(error);
  }
});


router.get("/:id", async (req, res, next) => {
  try {
    const booking = await getBookingById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json(booking);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const validationError = validateBookingBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newBooking = await createBooking(req.body);
    res.status(201).json(newBooking);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const existingBooking = await getBookingById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const mergedBooking = {
      ...existingBooking,
      ...req.body,
    };

    const updatedBooking = await updateBooking(req.params.id, mergedBooking);
    res.status(200).json(updatedBooking);
  } catch (error) {
    next(error);
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    const existingBooking = await getBookingById(req.params.id);

    if (!existingBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const deletedBooking = await deleteBooking(req.params.id);
    res.status(200).json(deletedBooking);
  } catch (error) {
    next(error);
  }
});

export default router;