import * as Sentry from "@sentry/node";

export function errorHandler(err, req, res, next) {
  console.error(err);
  Sentry.captureException(err);

  res.status(500).json({
    message: "An error occurred on the server, please double-check your request!",
  });
}