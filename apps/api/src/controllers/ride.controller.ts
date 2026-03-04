import { Request, Response, NextFunction } from "express";
import {
  ICreateRidePayload,
  IGetRideQueryPayload,
  IDeleteRidePayload,
  IPopularRidesPayload,
} from "@journey-link/shared";
import { AuthRequest } from "../middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { MongoIdParam } from "../schemas/idSchema";
import { RideService, rideService } from "../services/ride.service";

export class RideController {
  constructor(private rideService: RideService) {}

  getRides = async (
    req: Request<unknown, unknown, unknown, IGetRideQueryPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const rides = await this.rideService.getRides(req.query);
      return res.success(rides, "", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  createRide = async (
    req: AuthRequest<unknown, unknown, ICreateRidePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.userId;
      const createdRide = await this.rideService.createRide(userId!, req.body);
      return res.success(
        createdRide,
        "Ride Created Successfully",
        StatusCodes.CREATED
      );
    } catch (error) {
      next(error);
    }
  };

  getRideById = async (
    req: AuthRequest<MongoIdParam>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const rideDetails = await this.rideService.getRideById(id, userId!);
      return res.success(rideDetails, "", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  deleteRide = async (
    req: AuthRequest<MongoIdParam, unknown, IDeleteRidePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const deletedRide = await this.rideService.deleteRide(id, userId!, req.body);
      return res.success(deletedRide, "Ride Cancelled Successfully", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  updateRide = async (
    req: AuthRequest<MongoIdParam, unknown, ICreateRidePayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const updatedRide = await this.rideService.updateRide(id, userId!, req.body);
      return res.success(updatedRide, "Ride Updated Successfully", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };
  getPopularTrips = async (
    req: Request<unknown, unknown, unknown, IPopularRidesPayload>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const limit = req.query.limit;
      const popularTrips = await this.rideService.getPopularTrips(limit);
      return res.success(popularTrips, "", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };
}

export const rideController = new RideController(rideService);
