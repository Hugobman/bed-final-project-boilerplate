import "./instrument.js";
import express from "express";
import * as Sentry from "@sentry/node";

import loginRoutes from "./routes/login.routes.js";
import usersRoutes from "./routes/users.routes.js";
import hostsRoutes from "./routes/hosts.routes.js";
import propertiesRoutes from "./routes/properties.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";
import reviewsRoutes from "./routes/reviews.routes.js";

import { loggerMiddleware } from "./middleware/logger.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.status(200).json({ message: "API is running" });
});

app.use("/login", loginRoutes);
app.use("/users", usersRoutes);
app.use("/hosts", hostsRoutes);
app.use("/properties", propertiesRoutes);
app.use("/bookings", bookingsRoutes);
app.use("/reviews", reviewsRoutes);

// Sentry.io Express error handler
if (typeof Sentry.setupExpressErrorHandler === "function") {
  Sentry.setupExpressErrorHandler(app);
}

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});