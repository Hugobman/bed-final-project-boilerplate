import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../services/properties.service.js";

const router = express.Router();

function validatePropertyBody(body) {
  const requiredFields = [
    "title",
    "description",
    "location",
    "pricePerNight",
    "bedroomCount",
    "bathRoomCount",
    "maxGuestCount",
    "rating",
    "hostId",
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
    const properties = await getAllProperties({
      location: req.query.location,
      pricePerNight: req.query.pricePerNight,
    });

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
});



router.get("/:id", async (req, res, next) => {
  try {
    const property = await getPropertyById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
});

router.post("/",  async (req, res, next) => {
  try {
    const validationError = validatePropertyBody(req.body);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newProperty = await createProperty(req.body);
    res.status(201).json(newProperty);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const existingProperty = await getPropertyById(req.params.id);

    if (!existingProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    const mergedProperty = {
      ...existingProperty,
      ...req.body,
    };

    const updatedProperty = await updateProperty(req.params.id, mergedProperty);
    res.status(200).json(updatedProperty);
  } catch (error) {
    next(error);
  }
});


router.delete("/:id",  async (req, res, next) => {
  try {
    const existingProperty = await getPropertyById(req.params.id);

    if (!existingProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    const deletedProperty = await deleteProperty(req.params.id);
    res.status(200).json(deletedProperty);
  } catch (error) {
    next(error);
  }
});

export default router;