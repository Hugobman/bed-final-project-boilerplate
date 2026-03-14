import express from "express";
import jwt from "jsonwebtoken";
import { findUserByCredentials } from "../services/auth.service.js";

const router = express.Router();

router.post("/", async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    const account = await findUserByCredentials(username, password);

    if (!account) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        sub: account.id,
        username: account.username,
        role: account.role,
      },
      process.env.AUTH_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});

export default router;