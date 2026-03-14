import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../services/users.service.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

function validateUserBody(body, requirePassword = true) {
  const requiredFields = ["username", "name", "email", "phoneNumber", "pictureUrl"];

  if (requirePassword) {
    requiredFields.push("password");
  }

  for (const field of requiredFields) {
    if (!body[field]) {
      return `Missing required field: ${field}`;
    }
  }

  return null;
}

router.get("/", async (req, res, next) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {

    const user = await getUserById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.post("/",  async (req, res, next) => {
  try {
    const validationError = validateUserBody(req.body, true);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newUser = await createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

router.put("/:id",  async (req, res, next) => {
  try {
    const existingUser = await getUserById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const validationError = validateUserBody(req.body, false);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id",  async (req, res, next) => {
  try {
    const existingUser = await getUserById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const deletedUser = await deleteUser(req.params.id);
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

export default router;