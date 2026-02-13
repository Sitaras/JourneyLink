import { Ride } from "../models/ride.model";
import { BookingStatus, IGetRideQueryPayload } from "@journey-link/shared";

export class RideRepository {
  addSeatCalculationStages(pipeline: any[]): void {
    pipeline.push(
      {
        $addFields: {
          bookedSeats: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$passengers",
                    as: "p",
                    cond: { $eq: ["$$p.status", BookingStatus.CONFIRMED] },
                  },
                },
                as: "cp",
                in: "$$cp.seatsBooked",
              },
            },
          },
        },
      },
      {
        $addFields: {
          remainingSeats: { $subtract: ["$availableSeats", "$bookedSeats"] },
        },
      }
    );
  }

  addDriverInfo(pipeline: any[]): void {
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "driver",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: { path: "$user", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "user.profile",
          foreignField: "_id",
          as: "driverProfile",
        },
      },
      {
        $unwind: { path: "$driverProfile", preserveNullAndEmptyArrays: true },
      },
      {
        $addFields: {
          driverProfile: {
            $cond: {
              if: { $ne: ["$driverProfile", null] },
              then: {
                _id: "$driverProfile._id",
                firstName: "$driverProfile.firstName",
                lastName: "$driverProfile.lastName",
                email: "$driverProfile.email",
                phone: "$driverProfile.phone",
                avatar: "$driverProfile.avatar",
                rating: "$driverProfile.rating",
              },
              else: null,
            },
          },
        },
      },
      {
        $project: {
          user: 0, // Remove the temporary user object
        },
      }
    );
  }

  private buildMatchStage(query: IGetRideQueryPayload) {
    const { departureDate, maxPrice, smokingAllowed, petsAllowed } = query;

    const matchStage: any = {
      status: "active",
      departureTime: { $gte: new Date() },
    };

    if (departureDate) {
      const date = new Date(departureDate);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);
      matchStage.departureTime = { $gte: date, $lt: nextDay };
    }

    if (maxPrice) {
      matchStage.pricePerSeat = { $lte: parseFloat(maxPrice as any) };
    }

    if (smokingAllowed !== undefined) {
      matchStage["preferences.smokingAllowed"] = smokingAllowed;
    }

    if (petsAllowed !== undefined) {
      matchStage["preferences.petsAllowed"] = petsAllowed;
    }

    return matchStage;
  }

  private buildSortStage(
    sortBy: string,
    sortOrder: string,
    hasGeoQuery: boolean
  ): any {
    const sortStage: any = {};

    switch (sortBy) {
      case "price":
        sortStage.pricePerSeat = sortOrder === "asc" ? 1 : -1;
        break;
      case "distance":
        if (hasGeoQuery) {
          sortStage.originDistance = sortOrder === "asc" ? 1 : -1;
        } else {
          sortStage.departureTime = sortOrder === "asc" ? 1 : -1;
        }
        break;
      default:
        sortStage.departureTime = sortOrder === "asc" ? 1 : -1;
    }

    return sortStage;
  }

  async findRides(query: IGetRideQueryPayload) {
    const {
      originLat,
      originLng,
      originRadius = 50,
      destinationLat,
      destinationLng,
      destinationRadius = 50,
      minSeats,
      page = 1,
      limit = 10,
      sortBy = "departureTime",
      sortOrder = "asc",
    } = query;

    const pipeline: any[] = [];
    const matchStage = this.buildMatchStage(query);

    const hasOriginCoords = !!originLat && !!originLng;
    const hasDestinationCoords = !!destinationLat && !!destinationLng;

    if (hasOriginCoords) {
      pipeline.push({
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [
              parseFloat(originLng as any),
              parseFloat(originLat as any),
            ],
          },
          distanceField: "originDistance",
          maxDistance: (originRadius as number) * 1000,
          spherical: true,
          key: "origin.coordinates",
          query: matchStage,
        },
      });
    } else {
      pipeline.push({ $match: matchStage });

      if (query.originCity) {
        pipeline.push({
          $match: {
            "origin.city": { $regex: query.originCity, $options: "i" },
          },
        });
      }
    }

    if (hasDestinationCoords) {
      pipeline.push({
        $match: {
          "destination.coordinates": {
            $geoWithin: {
              $centerSphere: [
                [
                  parseFloat(destinationLng as any),
                  parseFloat(destinationLat as any),
                ],
                (destinationRadius as number) / 6378.1,
              ],
            },
          },
        },
      });
    } else if (query.destinationCity) {
      pipeline.push({
        $match: {
          "destination.city": {
            $regex: query.destinationCity,
            $options: "i",
          },
        },
      });
    }

    this.addSeatCalculationStages(pipeline);

    if (minSeats) {
      pipeline.push({
        $match: { remainingSeats: { $gte: parseInt(minSeats as any) } },
      });
    }

    this.addDriverInfo(pipeline);

    pipeline.push({
      $project: {
        _id: 1,
        origin: 1,
        destination: 1,
        departureTime: 1,
        availableSeats: 1,
        remainingSeats: 1,
        pricePerSeat: 1,
        preferences: 1,
        originDistance: 1,
        driverProfile: {
          avatar: 1,
          rating: 1,
        },
        createdAt: 1,
      },
    });

    const sortStage = this.buildSortStage(
      sortBy as string,
      sortOrder as string,
      hasOriginCoords
    );
    pipeline.push({ $sort: sortStage });

    // Pagination
    const skip = (page - 1) * limit;
    pipeline.push({ $skip: skip }, { $limit: limit });

    const rides = await Ride.aggregate(pipeline);

    // Count total
    const countPipeline = pipeline.filter(
      (stage) =>
        !("$skip" in stage) && !("$limit" in stage) && !("$sort" in stage)
    );
    countPipeline.push({ $count: "total" });
    const countResult = await Ride.aggregate(countPipeline);
    const total = countResult.length > 0 ? countResult[0].total : 0;

    return {
      count: rides.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: rides,
    };
  }
}

export const rideRepository = new RideRepository();
