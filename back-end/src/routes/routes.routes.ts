import { RequestHandler, Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { RoutesController } from "../controllers/routes.controller";
import { validateData } from "../middleware/validationMiddleware";
import {
  createRouteSchema,
  deleteRouteSchema,
  getRoutesQuerySchema,
  mongoIdSchema,
} from "../schemas/routesSchema";

const router = Router();

/**
 * @route   POST /api/routes
 * @desc    Create new route
 * @access  Private (requires authentication)
 */
router.post(
  "/",
  authenticateToken,
  validateData(createRouteSchema),
  RoutesController.createRoute
);

/**
 * @route   DELETE /api/routes/:id
 * @desc    Cancel/delete route
 * @access  Private (requires authentication + ownership)
 */
router.delete(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  validateData(deleteRouteSchema, "body"),
  RoutesController.deleteRoute
);

/**
 * @route   GET /api/routes
 * @desc    Create new route
 */
router.get(
  "/",
  validateData(getRoutesQuerySchema, "query"),
  RoutesController.getRoutes as unknown as RequestHandler
);

/**
 * @route   GET /api/routes/:id
 * @desc    Get single route by ID
 * @access  Public
 */
router.get(
  "/:id",
  authenticateToken,
  validateData(mongoIdSchema, "params"),
  RoutesController.getRouteById as unknown as RequestHandler
);


/**
 * @route   PUT /api/routes/:id
 * @desc    Update route
 * @access  Private (requires authentication + ownership)
 */
// router.put(
//   "/:id",
//   updateRoute
// );

export const routes = router;
