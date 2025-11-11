import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { connectDB } from "./db.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import logger from "./utils/logger.js";

const app = express();
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) logLine = logLine.slice(0, 79) + "…";
      log(logLine);
    }
  });

  next();
});


(async () => {
  await connectDB();
  const server = await registerRoutes(app);

  // 404 Handler - must be after all routes
  app.use(notFoundHandler);

  // Global Error Handler - must be last
  app.use(errorHandler);

  // Graceful error handling for uncaught exceptions
  process.on('uncaughtException', (err) => {
    logger.error({ err }, 'UNCAUGHT EXCEPTION! Shutting down...');
    process.exit(1);
  });

  process.on('unhandledRejection', (err) => {
    logger.error({ err }, 'UNHANDLED REJECTION! Shutting down...');
    server.close(() => {
      process.exit(1);
    });
  });

  const port = parseInt(process.env.PORT || "5003", 10);
  server.listen(port, "localhost", () => {
    logger.info(`Server running on port ${port}`);
    log(`serving on port ${port}`);
  });
})();