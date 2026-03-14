import express from "express";
import { authenticateToken } from "../middleware/auth.js";
import {
  getAllHosts,
  getHostById,
  createHost,
  updateHost,
  deleteHost,
} from "../services/hosts.service.js";

const router = express.Router();

function validateHostBody(body, requirePassword = true) {
  const requiredFields = [
    "username",
    "name",
    "email",
    "phoneNumber",
    "pictureUrl",
    "aboutMe",
  ];

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
    const hosts = await getAllHosts();
    res.status(200).json(hosts);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const host = await getHostById(req.params.id);

    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    res.status(200).json(host);
  } catch (error) {
    next(error);
  }
});

router.post("/",  async (req, res, next) => {
  try {
    const validationError = validateHostBody(req.body, true);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const newHost = await createHost(req.body);
    res.status(201).json(newHost);
  } catch (error) {
    next(error);
  }
});

router.put("/:id",  async (req, res, next) => {
  try {
    const existingHost = await getHostById(req.params.id);

    if (!existingHost) {
      return res.status(404).json({ message: "Host not found" });
    }

    const validationError = validateHostBody(req.body, false);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const updatedHost = await updateHost(req.params.id, req.body);
    res.status(200).json(updatedHost);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id",  async (req, res, next) => {
  try {
    const existingHost = await getHostById(req.params.id);

    if (!existingHost) {
      return res.status(404).json({ message: "Host not found" });
    }

    const deletedHost = await deleteHost(req.params.id);
    res.status(200).json(deletedHost);
  } catch (error) {
    next(error);
  }
});

export default router;