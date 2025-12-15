import { Response } from "express";
import {
  ICreateRidePayload,
  IGetRideQueryPayload,
  IDeleteRidePayload,
} from "@journey-link/shared";
import { AuthRequest } from "../middleware/auth.middleware";
import { StatusCodes } from "http-status-codes";
import { MongoIdParam } from "../schemas/idSchema";
import { RideService, rideService } from "../services/ride.service";

export class RideController {
  constructor(private rideService: RideService) {}

  getRides = async (
    req: AuthRequest<unknown, unknown, unknown, IGetRideQueryPayload>,
    res: Response,
    next: any
  ) => {
    try {
      const result = await this.rideService.getRides(req.query);
      return res.success(result, "", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  createRide = async (
    req: AuthRequest<unknown, unknown, ICreateRidePayload>,
    res: Response,
    next: any
  ) => {
    try {
      const userId = req.user?.userId;
      const result = await this.rideService.createRide(userId!, req.body);
      return res.success(
        result,
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
    next: any
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.rideService.getRideById(id, userId!);
      return res.success(result, "", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  deleteRide = async (
    req: AuthRequest<MongoIdParam, unknown, IDeleteRidePayload>,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.rideService.deleteRide(id, userId!, req.body);
      return res.success(result, "Ride Cancelled Successfully", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };

  updateRide = async (
    req: AuthRequest<MongoIdParam, unknown, ICreateRidePayload>,
    res: Response,
    next: any
  ) => {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;
      const result = await this.rideService.updateRide(id, userId!, req.body);
      return res.success(result, "Ride Updated Successfully", StatusCodes.OK);
    } catch (error) {
      next(error);
    }
  };
}

export const rideController = new RideController(rideService);
