import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { readFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname } from "path";

// Import routes
import userRouter from "./routes/userRoutes.js";
import hotelRouter from "./routes/hotelRoutes.js";
import connectCloudinary from "./configs/cloudinary.js";
import roomRouter from "./routes/roomRoutes.js";
import bookingRouter from "./routes/bookingRoutes.js";

// Connect to DB & Cloudinary
connectDB();
connectCloudinary();

const app = express();

// CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Middleware
app.use(express.json());

// ========== Swagger Setup (Minimal Changes) ==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Swagger YAML file
const swaggerYaml = await readFile(
  `${__dirname}/docs/swagger.yaml`,
  "utf-8"
);

// Only change: Added '/api' prefix to match your routes
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Hotel Booking API",
      version: "1.0.0",
      description: "API for managing hotels, rooms, and bookings",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}/api`, // Added '/api'
      },
    ],
  },
  apis: [`${__dirname}/docs/swagger.yaml`],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Swagger UI endpoint (unchanged)
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, { explorer: true })
);

// ========== Your Original Routes (No Changes) ==========
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/user", userRouter);
app.use("/api/hotels", hotelRouter);
app.use("/api/rooms", roomRouter);
app.use("/api/bookings", bookingRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/api-docs`);
});