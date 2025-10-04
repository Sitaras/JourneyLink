import { Router } from "express";
import { authRoutes } from "./auth.routes";
import { userRoutes } from "./user.routes";
import { placesRoutes } from "./places.routes";

const router = Router();

router.use("/auth", authRoutes);

router.use("/me", userRoutes);

router.use("/", placesRoutes);

export default router;
