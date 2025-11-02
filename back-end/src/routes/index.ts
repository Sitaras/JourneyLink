import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { placesRoutes } from "./places.routes";
import { bookingRoutes } from "./booking.routes";
import { routes } from "./routes.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/me", userRoutes);

router.use("/", placesRoutes);

router.use("/routes", routes);

router.use("/bookings", bookingRoutes);

export default router;
