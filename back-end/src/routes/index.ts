import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { placesRoutes } from "./places.routes";
import { bookingRides } from "./booking.routes";
import { rideRoutes } from "./ride.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/me", userRoutes);

router.use("/", placesRoutes);

router.use("/ride", rideRoutes);

router.use("/booking", bookingRides);

export default router;
