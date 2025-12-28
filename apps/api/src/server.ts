import express, { urlencoded, json } from "express";

import cors from "cors";
import { connectDB } from "./db/connectDB";
import { config } from "./config/config";
import { startAgenda } from "./config/agenda";
import { successResponse } from "./middleware/successResponse.middleware";
import { errorResponse } from "./middleware/errorResponse.middleware";
import { globalErrorHandler } from "./middleware/globalError.middleware";
import router from "./routes";
import { rideService } from "./services/ride.service";

const app = express();
const PORT = config.port;

// Security and parsing middleware
app.use(cors());
app.use(urlencoded({ extended: true }));
app.use(json());

// Response enhancers
app.use(successResponse);
app.use(errorResponse);

// Routes
app.use("/api", router);

// Global Error Handler (must be last)
app.use(globalErrorHandler);

app.listen(PORT, async () => {
  await connectDB();
  await startAgenda();
  if (config.env === "development") {
    await rideService.checkAndCompleteRides();
  }
  console.log("Server is running on port: ", PORT);
});
